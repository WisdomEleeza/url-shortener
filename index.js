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
    const urlPattern = /^(http|https):\/\/www\..+\..+$/;
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
/*
* You can POST a URL to /api/shorturl and get a JSON response with original_url and short_url properties. 
  Here's an example: { original_url : 'https://freeCodeCamp.org', short_url : 1}
* When you visit /api/shorturl/<short_url>, you will be redirected to the original URL.
* If you pass an invalid URL that doesn't follow the valid http://www.example.com format, 
  the JSON response will contain { error: 'invalid url' }

 */






app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
