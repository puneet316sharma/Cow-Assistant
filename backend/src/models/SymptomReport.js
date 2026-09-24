import mongoose from 'mongoose';

const symptomReportSchema = new mongoose.Schema(
  {
    cowId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Cow',
      required: true,
      index: true
    },
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    symptomsText: {
      type: String,
      required: [true, 'Symptoms text is required'],
      trim: true
    },
    reportedAt: {
      type: Date,
      default: Date.now
    },
    aiResponse: {
      possibleCauses: [{ type: String }],
      warningSigns: [{ type: String }],
      recommendedNextSteps: [{ type: String }],
      urgencyLevel: {
        type: String,
        enum: ['low', 'medium', 'high', 'emergency'],
        default: 'low'
      },
      disclaimer: {
        type: String,
        default: 'This is general AI guidance based on provided information, not a veterinary diagnosis or prescription. Consult a licensed veterinarian for medical decisions.'
      }
    },
    rawGeminiResponse: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      enum: ['open', 'resolved'],
      default: 'open'
    }
  },
  {
    timestamps: true
  }
);

const SymptomReport = mongoose.model('SymptomReport', symptomReportSchema);
export default SymptomReport;
