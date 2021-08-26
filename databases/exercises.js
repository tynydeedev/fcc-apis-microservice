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

const logSchema = new Schema({
  description: String,
  duration: Number,
  date: Date
});

const userSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  count: Number,
  logs: [logSchema]
});

const User = mongoose.model('User', userSchema);

const createUser = (name, done) => {
  const newUser = new User({ username: name, count: 0 });
  newUser.save((err, data) => {
    if (err) return done(err);
    done(null, data);
  })
};

const addExercise = (id, desc, number, date, done) => {
  User.findById(id, (err, data) => {
    if (err) return done(err);

    // When sending invalid id, the database will return null as the data, no error
    if (data === null) {
      return done(null, data);
    }

    data.logs.push({ description: desc, duration: number, date: date });
    data.count = data.count + 1;
    data.save((err, data) => {
      if (err) return done(err);
      done(null, data);
    })
  });
};

const findAllUser = (done) => {
  User.find({}, '_id username', (err, data) => {
    if (err) return done(err);
    done(null, data);
  })
}

module.exports = { User, createUser, addExercise, findAllUser };