const mongoose = require('mongoose');

const conversationMessageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['candidate', 'interviewer'],
    required: true
  },
  message: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const questionSchema = new mongoose.Schema({
  qNo: {
    type: Number,
    required: true
  },
  question: { 
    type: String,
    required: true
  },
  userCode: {
    type: String,
    default: ""
  },
  spokenAnswer: { 
    type: String,
    default: ""
  },
  crossQuestion: {
    type: String,
    default: ""
  },
  crossQuestionAnswer: {
    type: String,
    default: ""
  },
  evaluationStatus: {
    type: String,
    enum: ['pending', 'correct', 'partiallyCorrect', 'incorrect'],
    default: 'pending'
  },
  conversationHistory: [conversationMessageSchema],
  isComplete: {
    type: Boolean,
    default: false
  },
  currentPhase: {
    type: String,
    enum: ['main', 'followup', 'cross', 'completed'],
    default: 'main'
  }
});

const interviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  topic: {
    type: String,
    required: true
  },
  questions: [questionSchema], 
  currentQIndex: {
    type: Number,
    default: 0
  },
  overallStatus: {
    type: String,
    enum: ['inProgress', 'completed', 'cancelled'],
    default: 'inProgress'
  },
  totalQuestions: {
    type: Number,
    default: 0
  },
  timeLimit: {
    type: Number,
    default: 2400 // 40 minutes in seconds
  },
  aiSettings: {
    useContextualResponses: {
      type: Boolean,
      default: true
    },
    maxFollowUps: {
      type: Number,
      default: 1
    },
    feedback: {
    type: mongoose.Schema.Types.Mixed,
    default: null
  },
  feedbackGeneratedAt: {
    type: Date,
    default: null
  }
  }
}, { timestamps: true }); 

const Interview = mongoose.model('Interview', interviewSchema);

module.exports = Interview;