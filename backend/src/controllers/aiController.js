import Cow from '../models/Cow.js';
import VaccinationRecord from '../models/VaccinationRecord.js';
import HealthEvent from '../models/HealthEvent.js';
import SymptomReport from '../models/SymptomReport.js';
import { analyzeSymptomsWithGemini } from '../services/geminiService.js';
import { updateCowDerivedStatus } from './cowController.js';

export const analyzeSymptoms = async (req, res, next) => {
  try {
    const tagId = req.params.tagId.trim().toUpperCase();
    const { symptomsText } = req.body;

    if (!symptomsText || !symptomsText.trim()) {
      return res.status(400).json({ message: 'Symptoms description text is required' });
    }

    const cow = await Cow.findOne({ tagId });
    if (!cow) {
      return res.status(404).json({ message: `Cow with Tag ID '${tagId}' not found` });
    }

    if (req.user.role === 'farmer' && cow.ownerId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to request AI analysis for this cow' });
    }

    // Gather context
    const vaccinations = await VaccinationRecord.find({ cowId: cow._id }).sort({ dateAdministered: -1 });
    const pastHealthEvents = await HealthEvent.find({ cowId: cow._id }).sort({ date: -1 }).limit(10);

    const cowProfile = {
      tagId: cow.tagId,
      breed: cow.breed,
      age: cow.age,
      sex: cow.sex,
      weight: cow.weight,
      currentStatus: cow.status
    };

    const vaccinationHistory = vaccinations.map(v => ({
      vaccineName: v.vaccineName,
      dateAdministered: v.dateAdministered,
      nextDueDate: v.nextDueDate,
      status: v.status
    }));

    const formattedEvents = pastHealthEvents.map(e => ({
      type: e.type,
      title: e.title,
      description: e.description,
      date: e.date
    }));

    // Call Gemini Service
    const { aiResponse, rawGeminiResponse } = await analyzeSymptomsWithGemini({
      cowProfile,
      vaccinationHistory,
      pastHealthEvents: formattedEvents,
      symptomsText
    });

    // Save SymptomReport
    const symptomReport = await SymptomReport.create({
      cowId: cow._id,
      reportedBy: req.user.id,
      symptomsText,
      aiResponse,
      rawGeminiResponse,
      status: 'open'
    });

    // Save corresponding HealthEvent (type: symptom_report)
    await HealthEvent.create({
      cowId: cow._id,
      type: 'symptom_report',
      title: `AI Health Assessment: ${aiResponse.urgencyLevel.toUpperCase()} Urgency`,
      description: `Symptoms: "${symptomsText}". Top Cause: ${aiResponse.possibleCauses[0] || 'Unspecified'}`,
      date: new Date(),
      recordedBy: req.user.name,
      relatedAIAnalysisId: symptomReport._id
    });

    // Recalculate Cow Status
    await updateCowDerivedStatus(cow._id);

    res.status(201).json(symptomReport);
  } catch (error) {
    next(error);
  }
};
