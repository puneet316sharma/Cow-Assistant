import Cow from '../models/Cow.js';
import VaccinationRecord from '../models/VaccinationRecord.js';
import HealthEvent from '../models/HealthEvent.js';
import { updateCowDerivedStatus } from './cowController.js';

export const addVaccination = async (req, res, next) => {
  try {
    const tagId = req.params.tagId.trim().toUpperCase();
    const cow = await Cow.findOne({ tagId });

    if (!cow) {
      return res.status(404).json({ message: `Cow with Tag ID '${tagId}' not found` });
    }

    if (req.user.role === 'farmer' && cow.ownerId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to add vaccination for this cow' });
    }

    const { vaccineName, dateAdministered, nextDueDate, administeredBy, notes } = req.body;

    if (!vaccineName || !dateAdministered || !nextDueDate) {
      return res.status(400).json({ message: 'Vaccine name, date administered, and next due date are required' });
    }

    const record = await VaccinationRecord.create({
      cowId: cow._id,
      vaccineName,
      dateAdministered: new Date(dateAdministered),
      nextDueDate: new Date(nextDueDate),
      administeredBy: administeredBy || req.user.name,
      notes: notes || ''
    });

    // Create a corresponding HealthEvent entry
    await HealthEvent.create({
      cowId: cow._id,
      type: 'vaccination',
      title: `Vaccination: ${vaccineName}`,
      description: `Administered by ${administeredBy || req.user.name}. Next due date: ${new Date(nextDueDate).toLocaleDateString()}.${notes ? ` Notes: ${notes}` : ''}`,
      date: new Date(dateAdministered),
      recordedBy: req.user.name
    });

    // Recalculate cow status
    await updateCowDerivedStatus(cow._id);

    res.status(201).json(record);
  } catch (error) {
    next(error);
  }
};

export const getVaccinationsByCow = async (req, res, next) => {
  try {
    const tagId = req.params.tagId.trim().toUpperCase();
    const cow = await Cow.findOne({ tagId });

    if (!cow) {
      return res.status(404).json({ message: `Cow with Tag ID '${tagId}' not found` });
    }

    if (req.user.role === 'farmer' && cow.ownerId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to view records for this cow' });
    }

    const records = await VaccinationRecord.find({ cowId: cow._id }).sort({ dateAdministered: -1 });
    res.json(records);
  } catch (error) {
    next(error);
  }
};

export const getDueVaccinations = async (req, res, next) => {
  try {
    // Filter cows owned by farmer unless user is vet/admin
    const cowFilter = {};
    if (req.user.role === 'farmer') {
      cowFilter.ownerId = req.user.id;
    }

    const cows = await Cow.find(cowFilter).select('_id tagId breed ownerId status');
    const cowIds = cows.map(c => c._id);

    const allRecords = await VaccinationRecord.find({ cowId: { $in: cowIds } })
      .populate('cowId', 'tagId breed status ownerId')
      .sort({ nextDueDate: 1 });

    // Filter only records that are overdue or due_soon
    const dueRecords = allRecords.filter(r => r.status === 'overdue' || r.status === 'due_soon');

    res.json(dueRecords);
  } catch (error) {
    next(error);
  }
};
