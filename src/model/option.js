const mongoose = require('mongoose');

const optionSchema = new mongoose.Schema({
    text: { type: String, required: true },
    imageUrl: { type: String, required: true },
    impressions: { type: Number, default: 0 },  // For Polls, track how many people opted for this option
  });
  

  const Option = mongoose.model('Option', optionSchema);
  
  module.exports = Option;
  
