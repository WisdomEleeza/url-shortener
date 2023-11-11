require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

const urlDatabase = [];
let counter = 1;

app.post('/api/shorturl', (req, res) => {
  const originalUrl = req.body.url;

  // Validate URL format
  const urlRegex = /^(http|https):\/\/www\..+\..+$/;
  if (!urlRegex.test(originalUrl)) {
    return res.json({ error: 'invalid url' });
  }

  // Generate short URL and store in database
  const shortUrl = counter++;
  urlDatabase.push({ originalUrl, shortUrl });

  // Respond with JSON
  res.json({ original_url: originalUrl, short_url: shortUrl });
});

app.get('/api/shorturl/:short_url', (req, res) => {
  const shortUrl = parseInt(req.params.short_url);

  // Look up short URL in the database
  const entry = urlDatabase.find(entry => entry.shortUrl === shortUrl);

  if (!entry) {
    return res.json({ error: 'short url not found' });
  }

  // Redirect to the original URL
  res.redirect(entry.originalUrl);
});







app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
