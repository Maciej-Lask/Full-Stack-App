const mongoose = require('mongoose');


const connectToDB = () => {

  // connect to DB
  mongoose.connect('mongodb://127.0.0.1:27017/fullStackAppDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const db = mongoose.connection;

  // on success
  db.once('open', () => {
    console.log('Connected to the database');
  });

  // on error
  db.on('error', (err) => console.log('Error ' + err));
}

module.exports = connectToDB;