import mongoose from 'mongoose';

const cowSchema = new mongoose.Schema(
  {
    tagId: {
      type: String,
      required: [true, 'Tag ID is required'],
      unique: true,
      index: true,
      uppercase: true,
      trim: true
    },
    breed: {
      type: String,
      required: [true, 'Breed is required'],
      trim: true
    },
    age: {
      type: Number,
      required: [true, 'Age is required'],
      min: [0, 'Age must be non-negative']
    },
    sex: {
      type: String,
      enum: ['male', 'female'],
      required: [true, 'Sex is required']
    },
    weight: {
      type: Number,
      required: [true, 'Weight is required'],
      min: [0, 'Weight must be positive']
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    photoUrl: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      enum: ['healthy', 'needs_attention', 'critical'],
      default: 'healthy'
    }
  },
  {
    timestamps: true
  }
);

const Cow = mongoose.model('Cow', cowSchema);
export default Cow;
