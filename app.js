require('dotenv').config();

// Using Express
const express = require('express');

// Init app
const app = express();

// Imports
const timestamp = require('./modules/01_timestamp.js');
const reqHeaderParser = require('./modules/02_header-parser.js');
const urlShortener = require('./modules/03_shortener.js');
const exerciseTracker = require('./modules/04_exercise-tracker.js');
const fileMetadata = require('./modules/05_file-data.js');

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
const cors = require('cors');
app.use(cors({ optionsSuccessStatus: 200 }));  // some legacy browsers choke on 204

// Using body-parser
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Public folder
app.use(express.static('public'));

// trust proxy
app.enable('trust proxy');

// Pages
app.get('/', (req, res) => {
	res.sendFile(__dirname + '/views/00_index.html');
});

app.get('/timestamp', (req, res) => {
	res.sendFile(__dirname + '/views/01_time-stamp.html');
});

app.get('/header-parser', (req, res) => {
	res.sendFile(__dirname + '/views/02_header-parser.html');
});

app.get('/shortener', (req, res) => {
	res.sendFile(__dirname + '/views/03_url-shortener.html');
})

app.get('/exercise', (req, res) => {
	res.sendFile(__dirname + '/views/04_exercise-tracker.html');
})

app.get('/file-data', (req, res) => {
	res.sendFile(__dirname + '/views/05_file-metadata.html');
})

// Router
app.use('/timestamp/api', timestamp);
app.use('/header-parser/api', reqHeaderParser);
app.use('/shortener/api', urlShortener);
app.use('/exercise/api', exerciseTracker);
app.use('/file-data/api', fileMetadata);

// listen for requests :)
const listener = app.listen(process.env.PORT || 3000, function () {
	console.log('Your app is listening on port ' + listener.address().port);
});