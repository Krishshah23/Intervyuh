import mongoose from 'mongoose';

export const ROUND_OPTIONS = ['Aptitude', 'Technical', 'HR', 'Technical + HR', 'GD', 'Final', 'Other'];
export const RESULT_OPTIONS = ['Pending', 'Selected', 'Rejected', 'Cleared Round'];

const interviewSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  company: { type: String, required: true, trim: true, maxlength: 150 },
  role: { type: String, required: true, trim: true, maxlength: 150 },
  date: { type: Date, required: true },
  round: { type: String, required: true, enum: ROUND_OPTIONS },
  result: { type: String, required: true, enum: RESULT_OPTIONS, default: 'Pending' },
  rating: { type: Number, required: true, min: 1, max: 10 },
  wentWell: { type: String, trim: true, maxlength: 3000, default: '' },
  wentWrong: { type: String, trim: true, maxlength: 3000, default: '' },
  questionsICouldntAnswer: { type: String, trim: true, maxlength: 3000, default: '' },
  keyLearning: { type: String, trim: true, maxlength: 3000, default: '' },
  whatToImprove: { type: String, trim: true, maxlength: 3000, default: '' },
  topicsToPrepare: { type: String, trim: true, maxlength: 3000, default: '' },
  additionalNotes: { type: String, trim: true, maxlength: 3000, default: '' },
}, { timestamps: true });

interviewSchema.index({ userId: 1, date: -1 });

export default mongoose.model('Interview', interviewSchema);
