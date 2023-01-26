const mongoose = require('mongoose');

const feedbackschema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
  data: {
    type: Date,
    default: Date.now(),
  },
});

const feedData = mongoose.model('FeedBack', feedbackschema);

module.exports = feedData;
