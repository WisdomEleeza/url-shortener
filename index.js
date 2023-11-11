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

const urlDatabase = {};
let nextShortUrlId = 1;

app.post('/api/shorturl', (req, res) => {
  try {
    const { original_url } = req.body;

    // Check if the URL is valid
    const urlPattern = /^(http):\/\/www\..+\..+$/;
    if (!urlPattern.test(original_url)) {
      res.json({ error: 'invalid url' });
      return;
    }

    // Generate a short URL
    const short_url = nextShortUrlId;
    nextShortUrlId++;

    // Store the mapping in the database
    urlDatabase[short_url] = original_url;

    // Respond with the original and short URLs
    res.json({
      original_url: original_url,
      short_url: short_url
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'internal server error' });
  }
});

app.get('/api/shorturl/:short_url', (req, res) => {
  const short_url = req.params.short_url;
  const original_url = urlDatabase[short_url];

  if (original_url) {
    // Redirect to the original URL
    res.redirect(original_url);
  } else {
    res.json({ error: 'short URL not found' });
  }
});






app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
