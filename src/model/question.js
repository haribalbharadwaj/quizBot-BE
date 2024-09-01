const mongoose = require('mongoose');
const {optionSchema} = require('../model/option');

const questionSchema = new mongoose.Schema({
    questionText: { type: String, required: true },
    type: { type: String, enum: ['Q&A', 'Poll'], required: true },
    options: { 
      type: [optionSchema], 
      validate: [arrayLimit, '{PATH} must have at least 2 options'] 
    },
    correctOptionIndex: { type: Number },  // Only for Q&A type to track the correct answer
    attempts: { type: Number, default: 0 },  // How many people attempted this question
    correctAttempts: { type: Number, default: 0 },  // How many answered correctly (Q&A only)
    incorrectAttempts: { type: Number, default: 0 },  // How many answered incorrectly (Q&A only)
  });
  
  function arrayLimit(val) {
    return val.length >= 2;
  }
  
  const Question = mongoose.model('Question', questionSchema);

  module.exports = Question;
  
  