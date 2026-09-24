import mongoose from 'mongoose';

const healthEventSchema = new mongoose.Schema(
  {
    cowId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Cow',
      required: true,
      index: true
    },
    type: {
      type: String,
      enum: ['vaccination', 'illness', 'checkup', 'treatment', 'symptom_report', 'followup'],
      required: true
    },
    title: {
      type: String,
      required: [true, 'Event title is required'],
      trim: true
    },
    description: {
      type: String,
      default: '',
      trim: true
    },
    date: {
      type: Date,
      default: Date.now
    },
    recordedBy: {
      type: String,
      required: true,
      trim: true
    },
    relatedAIAnalysisId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SymptomReport'
    }
  },
  {
    timestamps: true
  }
);

const HealthEvent = mongoose.model('HealthEvent', healthEventSchema);
export default HealthEvent;
