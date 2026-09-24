import Cow from '../models/Cow.js';
import VaccinationRecord from '../models/VaccinationRecord.js';
import HealthEvent from '../models/HealthEvent.js';
import SymptomReport from '../models/SymptomReport.js';

// Helper function to update cow status based on health events and vaccinations
export const updateCowDerivedStatus = async (cowId) => {
  try {
    const cow = await Cow.findById(cowId);
    if (!cow) return;

    // Check vaccinations
    const vaccinations = await VaccinationRecord.find({ cowId });
    const hasOverdue = vaccinations.some(v => v.status === 'overdue');
    const hasDueSoon = vaccinations.some(v => v.status === 'due_soon');

    // Check latest AI symptom report urgency
    const latestReport = await SymptomReport.findOne({ cowId }).sort({ createdAt: -1 });

    let newStatus = 'healthy';
    if (latestReport?.aiResponse?.urgencyLevel === 'emergency' || latestReport?.aiResponse?.urgencyLevel === 'high') {
      newStatus = 'critical';
    } else if (hasOverdue) {
      newStatus = 'needs_attention';
    } else if (hasDueSoon || latestReport?.aiResponse?.urgencyLevel === 'medium') {
      newStatus = 'needs_attention';
    }

    if (cow.status !== newStatus) {
      cow.status = newStatus;
      await cow.save();
    }
  } catch (err) {
    console.error(`Error updating cow derived status for ${cowId}:`, err);
  }
};

export const createCow = async (req, res, next) => {
  try {
    const { tagId, breed, age, sex, weight, photoUrl } = req.body;

    if (!tagId || !breed || age === undefined || !sex || weight === undefined) {
      return res.status(400).json({ message: 'Tag ID, breed, age, sex, and weight are required' });
    }

    const cleanTagId = tagId.trim().toUpperCase();
    const existingCow = await Cow.findOne({ tagId: cleanTagId });
    if (existingCow) {
      return res.status(400).json({ message: `A cow with Tag ID '${cleanTagId}' is already registered` });
    }

    const cow = await Cow.create({
      tagId: cleanTagId,
      breed,
      age: Number(age),
      sex,
      weight: Number(weight),
      photoUrl: photoUrl || '',
      ownerId: req.user.id
    });

    res.status(201).json(cow);
  } catch (error) {
    next(error);
  }
};

export const getCows = async (req, res, next) => {
  try {
    const { status, search } = req.query;
    
    // Scope to farmer's cows unless user is vet or admin
    const filter = {};
    if (req.user.role === 'farmer') {
      filter.ownerId = req.user.id;
    }

    if (status) {
      filter.status = status;
    }

    if (search) {
      filter.tagId = { $regex: search.trim(), $options: 'i' };
    }

    const cows = await Cow.find(filter).sort({ createdAt: -1 });
    res.json(cows);
  } catch (error) {
    next(error);
  }
};

export const getCowByTagId = async (req, res, next) => {
  try {
    const tagId = req.params.tagId.trim().toUpperCase();
    const cow = await Cow.findOne({ tagId });

    if (!cow) {
      return res.status(404).json({ message: `Cow with Tag ID '${tagId}' not found` });
    }

    // Check ownership if farmer
    if (req.user.role === 'farmer' && cow.ownerId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to view this cow record' });
    }

    // Fetch related records: vaccinations, health events, symptom reports
    const vaccinations = await VaccinationRecord.find({ cowId: cow._id }).sort({ dateAdministered: -1 });
    const healthEvents = await HealthEvent.find({ cowId: cow._id }).sort({ date: -1 });
    const symptomReports = await SymptomReport.find({ cowId: cow._id }).sort({ createdAt: -1 });

    res.json({
      cow,
      vaccinations,
      healthEvents,
      symptomReports
    });
  } catch (error) {
    next(error);
  }
};

export const updateCow = async (req, res, next) => {
  try {
    const tagId = req.params.tagId.trim().toUpperCase();
    const cow = await Cow.findOne({ tagId });

    if (!cow) {
      return res.status(404).json({ message: `Cow with Tag ID '${tagId}' not found` });
    }

    if (req.user.role === 'farmer' && cow.ownerId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this cow record' });
    }

    const { breed, age, sex, weight, photoUrl, status } = req.body;

    if (breed) cow.breed = breed;
    if (age !== undefined) cow.age = Number(age);
    if (sex) cow.sex = sex;
    if (weight !== undefined) cow.weight = Number(weight);
    if (photoUrl !== undefined) cow.photoUrl = photoUrl;
    if (status && ['healthy', 'needs_attention', 'critical'].includes(status)) cow.status = status;

    const updatedCow = await cow.save();
    res.json(updatedCow);
  } catch (error) {
    next(error);
  }
};

export const deleteCow = async (req, res, next) => {
  try {
    const tagId = req.params.tagId.trim().toUpperCase();
    const cow = await Cow.findOne({ tagId });

    if (!cow) {
      return res.status(404).json({ message: `Cow with Tag ID '${tagId}' not found` });
    }

    if (req.user.role === 'farmer' && cow.ownerId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this cow record' });
    }

    // Cascade delete associated records
    await VaccinationRecord.deleteMany({ cowId: cow._id });
    await HealthEvent.deleteMany({ cowId: cow._id });
    await SymptomReport.deleteMany({ cowId: cow._id });
    await Cow.deleteOne({ _id: cow._id });

    res.json({ message: `Cow '${tagId}' and all associated records deleted successfully` });
  } catch (error) {
    next(error);
  }
};
