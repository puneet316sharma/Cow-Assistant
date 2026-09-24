import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Cow from '../models/Cow.js';
import VaccinationRecord from '../models/VaccinationRecord.js';
import HealthEvent from '../models/HealthEvent.js';
import SymptomReport from '../models/SymptomReport.js';

export const seedDummyData = async () => {
  try {
    // Check if farmer account already exists
    const existingFarmer = await User.findOne({ email: 'farmer@cowassistant.com' });
    if (existingFarmer) {
      console.log('[Seed Engine] Virtual farmer account already exists.');
      return;
    }

    console.log('[Seed Engine] Seeding virtual farmer and demo herd database...');

    // 1. Create Virtual Farmer
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('password123', salt);

    const farmer = await User.create({
      name: 'John Farmer (Green Acres Dairy)',
      email: 'farmer@cowassistant.com',
      passwordHash,
      role: 'farmer'
    });

    // 2. Create Cows
    const cows = await Cow.insertMany([
      {
        tagId: 'COW-101',
        breed: 'Holstein Friesian',
        age: 3.5,
        sex: 'female',
        weight: 580,
        ownerId: farmer._id,
        status: 'healthy'
      },
      {
        tagId: 'COW-102',
        breed: 'Black Angus',
        age: 4.0,
        sex: 'female',
        weight: 620,
        ownerId: farmer._id,
        status: 'needs_attention'
      },
      {
        tagId: 'COW-103',
        breed: 'Jersey',
        age: 2.5,
        sex: 'female',
        weight: 450,
        ownerId: farmer._id,
        status: 'critical'
      },
      {
        tagId: 'COW-104',
        breed: 'Hereford',
        age: 5.0,
        sex: 'male',
        weight: 780,
        ownerId: farmer._id,
        status: 'healthy'
      }
    ]);

    const cowMap = {};
    cows.forEach(c => { cowMap[c.tagId] = c._id; });

    // 3. Create Vaccination Records
    const today = new Date();
    
    // Past date (6 months ago)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(today.getMonth() - 6);

    const sixMonthsFuture = new Date();
    sixMonthsFuture.setMonth(today.getMonth() + 6);

    // Due Soon (7 days in future)
    const sevenDaysFuture = new Date();
    sevenDaysFuture.setDate(today.getDate() + 7);

    // Overdue (10 days in past)
    const tenDaysPast = new Date();
    tenDaysPast.setDate(today.getDate() - 10);

    await VaccinationRecord.insertMany([
      {
        cowId: cowMap['COW-101'],
        vaccineName: 'Brucellosis Strain 19',
        dateAdministered: sixMonthsAgo,
        nextDueDate: sixMonthsFuture,
        administeredBy: 'Dr. Sarah Jenkins (Valley Vets)',
        notes: 'Routine booster administered during annual checkup.'
      },
      {
        cowId: cowMap['COW-102'],
        vaccineName: '7-Way Blackleg Clostridial',
        dateAdministered: sixMonthsAgo,
        nextDueDate: sevenDaysFuture,
        administeredBy: 'John Farmer',
        notes: 'Scheduled booster due within next week.'
      },
      {
        cowId: cowMap['COW-103'],
        vaccineName: 'Foot-and-Mouth Disease (FMD)',
        dateAdministered: sixMonthsAgo,
        nextDueDate: tenDaysPast,
        administeredBy: 'Dr. Sarah Jenkins',
        notes: 'Booster overdue. Cow requires immediate vaccination scheduling.'
      },
      {
        cowId: cowMap['COW-104'],
        vaccineName: 'Anthrax Spore Vaccine',
        dateAdministered: sixMonthsAgo,
        nextDueDate: sixMonthsFuture,
        administeredBy: 'John Farmer',
        notes: 'Spring booster completed.'
      }
    ]);

    // 4. Create AI Symptom Report for COW-103
    const symptomReport = await SymptomReport.create({
      cowId: cowMap['COW-103'],
      reportedBy: farmer._id,
      symptomsText: 'Cow is lethargic, refusing morning silage feed, has purulent nasal discharge, and elevated breathing rate.',
      aiResponse: {
        possibleCauses: [
          'Bovine Respiratory Disease Complex (BRDC / Shipping Fever)',
          'Infectious Bovine Rhinotracheitis (IBR)',
          'Acute Bacterial Pneumonia secondary to stress'
        ],
        warningSigns: [
          'Rectal temperature exceeding 104°F (40°C)',
          'Laborious open-mouth breathing or grunting',
          'Complete recumbency (unable or unwilling to stand)'
        ],
        recommendedNextSteps: [
          'Isolate Cow #COW-103 in a clean, dry, well-ventilated quarantine pen immediately',
          'Measure and record rectal temperature with a digital veterinary thermometer',
          'Contact a licensed large animal veterinarian for immediate clinical examination and prescription antibiotic evaluation'
        ],
        urgencyLevel: 'high',
        disclaimer: 'This is general AI guidance based on provided symptoms, not a veterinary diagnosis or prescription. Always consult a licensed veterinarian for medical decisions.'
      },
      rawGeminiResponse: '[SEED_SIMULATED_GEMINI_ASSESSMENT]',
      status: 'open'
    });

    // 5. Create Health Events
    await HealthEvent.insertMany([
      {
        cowId: cowMap['COW-101'],
        type: 'checkup',
        title: 'Routine Post-Calving Health Exam',
        description: 'Uterine involution complete. Body condition score 3.5. Clear for breeding cycle.',
        date: sixMonthsAgo,
        recordedBy: 'Dr. Sarah Jenkins'
      },
      {
        cowId: cowMap['COW-102'],
        type: 'illness',
        title: 'Mild Appetite Drop',
        description: 'Observed slight decrease in grain consumption after changing pasture block.',
        date: new Date(today.getTime() - 86400000 * 3), // 3 days ago
        recordedBy: 'John Farmer'
      },
      {
        cowId: cowMap['COW-103'],
        type: 'symptom_report',
        title: 'AI Health Assessment: HIGH Urgency',
        description: 'Symptoms: "Lethargy, refusal of silage, purulent nasal discharge". Top Cause: Bovine Respiratory Disease Complex',
        date: new Date(),
        recordedBy: 'John Farmer',
        relatedAIAnalysisId: symptomReport._id
      }
    ]);

    console.log('[Seed Engine] Successfully seeded virtual farmer and 4 cows with vaccination history & AI reports!');
  } catch (err) {
    console.error('[Seed Engine Error]:', err.message);
  }
};
