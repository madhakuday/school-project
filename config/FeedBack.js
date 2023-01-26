const mongoose = require('mongoose');
const url = process.env.LOGINDATABASE;

const databaseconnection = () => {
  mongoose.connect(url, (err) => {
    if (err) {
      console.log(err);
    }
    console.log('Feedback database done');
  });
};

databaseconnection();
