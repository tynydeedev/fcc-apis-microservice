// Imports
const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
const { User, createUser, addExercise, findAllUser } = require('../databases/exercises.js');

// Router
router.post('/users', (req, res, next) => {
  const name = req.body.username;
  createUser(name, (err, userCreated) => {
    if (err) return next(err);
    return res.json({ username: userCreated.username, _id: userCreated._id });
  })
})

router.get('/users', (req, res, next) => {
  findAllUser((err, data) => {
    if (err) return next(err);
    return res.json(data);
  });
});

router.post('/users/:id/exercises', (req, res) => {
  const id = req.params.id || req.body.id;
  const desc = req.body.description;
  const dur = req.body.duration;
  let date = (!req.body.date) ? '' : req.body.date;

  // Check date's validity
  if (date === '') {
    date = new Date();
  } else {
    date = new Date(date);
    if (isNaN(date)) {
      return res.json({ error: "Invalid Date" });
    }
  }

  // Check duration's validity
  if (isNaN(parseInt(dur))) {
    return res.json({ error: "Invalid Duration" });
  };

  // Check if description and duration is provided
  if (!desc || !dur) {
    return res.json({ error: "Please provide description and duration" });
  }

  addExercise(id, desc, dur, date, (err, data) => {
    if (err) return res.status(500).json({ error: "Cannot update exercise logs" });

    // If the data received is null (invalid id)
    if (data === null) {
      return res.json({ error: "Invalid userID" });
    }

    return res.json({
      _id: data._id,
      username: data.username,
      description: desc,
      duration: parseInt(dur),
      date: date.toDateString()
    });
  });
});

router.get('/users/:id/logs', (req, res, next) => {
  const id = req.params.id;
  const queries = req.query;
  const keys = Object.keys(queries);
  const FTL = keys.filter(key => /^from$|^to$|^limit$/.test(key));

  if (keys.length === 0 || FTL.length === 0) {
    User.findById(id, '-logs._id', (err, userFound) => {
      if (err) return next(err);
      // console.log(userFound.logs)
      return res.json({
        _id: userFound._id,
        username: userFound.username,
        count: userFound.count,
        log: userFound.logs
      });
    })
  } else {
    const fromDate = isNaN(new Date(queries.from)) ? new Date(0) : new Date(queries.from);
    const toDate = isNaN(new Date(queries.to)) ? new Date() : new Date(queries.to);
    const limit = isNaN(Number(queries.limit)) ? undefined : Number(queries.limit);

    User.findById(id, '-logs._id', (err, user) => {
      if (err) return next(err);
      let logReturn = user.logs
        .filter(log => log.date >= fromDate && log.date <= toDate)
        .slice(0, limit);

      return res.json({
        _id: user._id,
        username: user.username,
        count: logReturn.length,
        log: logReturn
      })
    });
  }
});

module.exports = router;