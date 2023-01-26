const mongoose = require('mongoose');

mongoose.connect(process.env.LOGINDATABASE, (err) => {
  if (err) {
    console.log(err);
  }
  console.log('login database done');
});
