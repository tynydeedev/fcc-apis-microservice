const mongoose = require('mongoose');
const { Schema } = mongoose;
const MONGO_URI = process.env['MONGO_URI'];

const mongoOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
};

mongoose.connect(MONGO_URI, mongoOptions);

const urlSchema = new Schema({
  fullUrl: {
    type: String,
    unique: true,
    required: true
  },
  shortUrl: {
    type: Number,
    unique: true,
    required: true
  },
  counter: Number
});

const URL = mongoose.model('URL', urlSchema);

const createURL = (url, number, done) => {
  const newURL = new URL({ fullUrl: url, shortUrl: number });
  newURL.save((err, data) => {
    if (err) return done(err);
    done(null, data);
  });
};

const searchURL = (url, done) => {
  URL.find({ fullUrl: url }, (err, data) => {
    if (err) return done(err);
    done(null, data);
  });
};

module.exports = { URL, createURL, searchURL };
