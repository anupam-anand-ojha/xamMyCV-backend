import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['mcq', 'scenario', 'project-deep-dive'],
    required: true,
  },
  question: {
    type: String,
    required: true,
  },
  relatedSkill: {
    type: String,
  },
  options: [String], 
  correctAnswer: {
    type: String,
  },
  userAnswer: {
    type: String,
    default: '',
  },
  aiEvaluation: {
    score: { type: Number, default: null },
    feedback: { type: String, default: '' },
  },
});

const testSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    resume: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Resume',
      required: true,
    },
    questions: [questionSchema],
    status: {
      type: String,
      enum: ['pending', 'in-progress', 'completed'],
      default: 'pending',
    },
    overallScore: {
      type: Number,
      default: null,
    },
    authenticityScore: {
      type: Number,
      default: null,
    },
  },
  { timestamps: true }
);

const Test = mongoose.model('Test', testSchema);

export default Test;