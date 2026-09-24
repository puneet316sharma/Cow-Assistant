import mongoose from 'mongoose';

const vaccinationRecordSchema = new mongoose.Schema(
  {
    cowId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Cow',
      required: true,
      index: true
    },
    vaccineName: {
      type: String,
      required: [true, 'Vaccine name is required'],
      trim: true
    },
    dateAdministered: {
      type: Date,
      required: [true, 'Date administered is required']
    },
    nextDueDate: {
      type: Date,
      required: [true, 'Next due date is required']
    },
    administeredBy: {
      type: String,
      required: [true, 'Administered by is required'],
      trim: true
    },
    notes: {
      type: String,
      default: '',
      trim: true
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Computed status virtual (not stored as source of truth)
vaccinationRecordSchema.virtual('status').get(function () {
  if (!this.nextDueDate) return 'completed';
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dueDate = new Date(this.nextDueDate);
  dueDate.setHours(0, 0, 0, 0);

  const diffTime = dueDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return 'overdue';
  } else if (diffDays <= 14) {
    return 'due_soon';
  } else {
    return 'completed';
  }
});

const VaccinationRecord = mongoose.model('VaccinationRecord', vaccinationRecordSchema);
export default VaccinationRecord;
