const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  const date = new Date();
  // date.setSeconds(date.getSeconds() - 23);
  res.json({ unix: date.getTime(), utc: date.toUTCString() });
});

router.get('/:date', (req, res) => {
  const reqDate = req.params.date;
  const dashRegex = /\-/;
  const letterRegex = /[a-zA-Z]/;
  let date;

  if (dashRegex.test(reqDate) || letterRegex.test(reqDate)) {
    date = new Date(reqDate).toUTCString();
  } else {
    date = new Date(Number(reqDate)).toUTCString();
  }

  if (date === 'Invalid Date') {
    return res.status(400).json({ error: "Invalid Date" });
  }

  const unix = Date.parse(date);
  res.json({ unix: unix, utc: date });
});

module.exports = router;