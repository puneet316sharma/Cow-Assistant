import Cow from '../models/Cow.js';
import VaccinationRecord from '../models/VaccinationRecord.js';
import SymptomReport from '../models/SymptomReport.js';

export const getDashboardSummary = async (req, res, next) => {
  try {
    const cowFilter = {};
    if (req.user.role === 'farmer') {
      cowFilter.ownerId = req.user.id;
    }

    const cows = await Cow.find(cowFilter);
    const totalCows = cows.length;
    const healthy = cows.filter(c => c.status === 'healthy').length;

    const cowIds = cows.map(c => c._id);

    // Get vaccinations due (overdue or due_soon)
    const allVaccinations = await VaccinationRecord.find({ cowId: { $in: cowIds } });
    const vaccinationsDue = allVaccinations.filter(v => v.status === 'overdue' || v.status === 'due_soon').length;

    // Get open health follow-ups (open symptom reports or critical status cows)
    const openReports = await SymptomReport.countDocuments({
      cowId: { $in: cowIds },
      status: 'open'
    });

    res.json({
      totalCows,
      vaccinationsDue,
      healthFollowUps: openReports,
      healthy
    });
  } catch (error) {
    next(error);
  }
};
