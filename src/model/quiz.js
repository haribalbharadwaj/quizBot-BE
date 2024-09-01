const mongoose = require('mongoose');

const optionSchema = new mongoose.Schema({
  text: { type: String, required: false },
  imageUrl: { type: String, required: false },
  selectedCount: { type: Number, default: 0 }
});

const questionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  options: [optionSchema],
  correctAnswerIndex: {
    type: Number,
    required: function() {
      // Required only if questionType is 'Qna'
      return this.questionType === 'Qna';
    },
    validate: {
      validator: function(value) {
        // Validate only if the question type is 'Qna'
        if (this.questionType === 'Qna') {
          return value !== undefined && value !== null;
        }
        return true; // If not 'Qna', validation passes
      },
      message: props => `correctAnswerIndex is not valid for the question type '${props.parent.questionType}'`
    }
  },
  incorrectCount: { type: Number, default: 0 }, // Tracks incorrect answers for Q&A
  correctCount: { type: Number, default: 0 }, // Tracks correct answers for Q&A
  totalImpressions: { type: Number, default: 0 }, // Tracks how many times the question was answered
  questionType: { type: String, enum: ['Qna', 'Poll'], required: true },
  timer: { type: Number, default: 0 }
});

const quizSchema = new mongoose.Schema({
  quizName: { type: String, required: true },
  questions: { type: [questionSchema], required: true },
  views: { type: Number, default: 0 },
  createdDate: { type: Date, default: Date.now },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

quizSchema.pre('save', async function(next) {
  // Update the user's quiz count and total questions
  const user = await mongoose.model('User').findById(this.createdBy);
  user.quizzesCreated += 1;
  user.totalQuestions += this.questions.length;
  user.save();
  next();
});

const Quiz = mongoose.model('Quiz', quizSchema);

module.exports = Quiz;
