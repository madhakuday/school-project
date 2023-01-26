const mongoose = require('mongoose');

const logindata = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
  username: { type: String },
  email: { type: String, unique: true },
  password: { type: String },
  Date: { type: Date, required: true, default: Date.now() },
});

module.exports = mongoose.model('logindata', logindata);
