// Imports
const mongoose = require('mongoose');
const { URL, createURL, searchURL } = require('../databases/url-db.js');

const express = require('express');
const router = express.Router();

const dns = require('dns');
const lookupOptions = {
  family: 4
}

// Set the variable to store the counter
let count;

// Router
router.post('/shorturl', (req, res) => {
  // Get the request URL
  const url = req.body.url;

  // Analyze the URL
  const httpsRegex = /^https?:\/\//; // URL has to start with http or https
  const regexLongUrl = /^.+?(?=\/)/; // Look for the forward slash in the end

  let pureUrl;

  if (httpsRegex.test(url)) {
    pureUrl = url.match(/(?<=https?:\/\/).+/)[0];
  } else {
    return res.json({ error: 'invalid url' });
  }

  let lookupUrl = pureUrl.match(regexLongUrl);
  if (lookupUrl === null) {
    lookupUrl = pureUrl;
  } else {
    lookupUrl = lookupUrl[0];
  }

  // Resolve the request URL
  dns.lookup(lookupUrl, lookupOptions, (err, address, family) => {
    if (err) return res.json({ error: 'invalid url' });
    // Search for the URL in the database
    searchURL(url, (err, urlFound) => {
      if (err) return res.status(500).json({ error: 'Database Error/Cannot find data' });
      // Found or not found any match
      if (urlFound.length === 0) {
        // Look for the counter in the database
        URL.findOne({ name: "Counter" }, '-_id -name', (err, data) => {
          if (err) return res.status(500).json({ error: 'Database Error/Cannot find counter' });
          count = data._doc.counter;
          // Create a new document in the database
          createURL(url, count, (err, urlCreated) => {
            if (err) return res.status(500).json({ error: 'Database Error/Cannot create new data' });
            // Retrieve the new data and send to client
            URL.findById(urlCreated._id, (err, data) => {
              if (err) return res.status(500).json({ error: 'Database Error/Cannot retrieve data' });
              return res.json({ original_url: data.fullUrl, short_url: data.shortUrl });
            });
            // Update the counter in the database
            URL.findOneAndUpdate({ name: "Counter" }, { counter: count + 1 }, { new: true }, (err) => {
              if (err) return res.status(500).json({ error: 'Database Error/Cannot update counter' });
            })
          });
        })
      } else {
        return res.json({ original_url: urlFound[0].fullUrl, short_url: urlFound[0].shortUrl });
      }
    });
  });
})

router.get('/shorturl/:id', (req, res) => {
  const id = req.params.id;
  URL.findOne({ shortUrl: id }, (err, data) => {
    if (err) return res.status(500).json({ error: 'Cannot redirect' });
    return res.redirect(data.fullUrl);
  })
})

module.exports = router;