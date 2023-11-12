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

  // Check if the URL is valid
  if (!validUrl.isWebUri(originalUrl)) {
    return res.json({ error: 'invalid url' });
  }

  // Create a short URL
  const shortUrl = counter++;
  
  // Save the original URL and short URL in the database
  urlDatabase[shortUrl] = originalUrl;

  // Send the JSON response
  res.json({
    original_url: originalUrl,
    short_url: shortUrl
  });
});

// Endpoint to redirect to the original URL
app.get('/api/shorturl/:short_url', (req, res) => {
  const shortUrl = parseInt(req.params.short_url);

  // Check if the short URL exists in the database
  if (urlDatabase.hasOwnProperty(shortUrl)) {
    // Redirect to the original URL
    return res.redirect(urlDatabase[shortUrl]);
  } else {
    // Short URL not found
    return res.json({ error: 'short url not found' });
  }
});







app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
