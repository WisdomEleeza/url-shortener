require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
const validUrl = require('valid-url');

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

// In-memory database to store shortened URLs
const urlDatabase = {};
let counter = 1;

// Endpoint to shorten a URL
app.post('/api/shorturl', (req, res) => {
  const originalUrl = req.body.original_url;

  if (!validUrl.isWebUri(originalUrl)) {
    return res.status(400).json({ error: 'invalid url' });
  }

  const shortUrl = counter++;
  urlDatabase[shortUrl] = originalUrl;

  res.json({
    original_url: originalUrl,
    short_url: shortUrl
  });
});

app.get('/api/shorturl/:short_url', (req, res) => {
  const shortUrl = parseInt(req.params.short_url);

  if (urlDatabase.hasOwnProperty(shortUrl)) {
    return res.redirect(urlDatabase[shortUrl]);
  } else {
    return res.status(404).json({ error: 'short url not found' });
  }
});






app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
