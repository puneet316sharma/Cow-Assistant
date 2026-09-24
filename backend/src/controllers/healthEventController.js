import Cow from '../models/Cow.js';
import HealthEvent from '../models/HealthEvent.js';

export const addHealthEvent = async (req, res, next) => {
  try {
    const tagId = req.params.tagId.trim().toUpperCase();
    const cow = await Cow.findOne({ tagId });

    if (!cow) {
      return res.status(404).json({ message: `Cow with Tag ID '${tagId}' not found` });
    }

    if (req.user.role === 'farmer' && cow.ownerId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to add health event for this cow' });
    }

    const { type, title, description, date } = req.body;

    if (!type || !title) {
      return res.status(400).json({ message: 'Event type and title are required' });
    }

    const event = await HealthEvent.create({
      cowId: cow._id,
      type,
      title,
      description: description || '',
      date: date ? new Date(date) : new Date(),
      recordedBy: req.user.name
    });

    res.status(201).json(event);
  } catch (error) {
    next(error);
  }
};

export const getHealthEventsByCow = async (req, res, next) => {
  try {
    const tagId = req.params.tagId.trim().toUpperCase();
    const cow = await Cow.findOne({ tagId });

    if (!cow) {
      return res.status(404).json({ message: `Cow with Tag ID '${tagId}' not found` });
    }

    if (req.user.role === 'farmer' && cow.ownerId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to view health events for this cow' });
    }

    const events = await HealthEvent.find({ cowId: cow._id }).sort({ date: -1 });
    res.json(events);
  } catch (error) {
    next(error);
  }
};
