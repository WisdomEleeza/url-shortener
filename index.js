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
  // const originalUrl = req.body.original_url;
  const { originalUrl } = req.body

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


/**
 * You can POST a URL to /api/shorturl and get a JSON response with original_url and short_url properties.
  Here's an example: { original_url : 'https://freeCodeCamp.org', short_url : 1}
  
 * When you visit /api/shorturl/<short_url>, you will be redirected to the original URL.
 * If you pass an invalid URL that doesn't follow the valid http://www.example.com format, the JSON response will contain { error: 'invalid url' }
 
 */



app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
