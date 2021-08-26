const express = require('express');
const dns = require('dns');
const router = express.Router();

router.get('/whoami', (req, res) => {
  const ip = req.ip;
  const language = req.get('accept-language');
  const software = req.get('user-agent');
  res.json({
    ipaddress: ip,
    language: language,
    software: software,
  });
})

module.exports = router;