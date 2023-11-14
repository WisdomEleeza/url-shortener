require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const dns = require('dns')
const urlparser = require('url')
const { MongoClient  } = require('mongodb');

const client = new MongoClient(process.env.DB_URL)
const db = client.db('urlshortener')
const urls = db.collection('urls')

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.post('/api/shorturl', function(req, res) {
  const url = req.body.url
  const dnslookup = dns.lookup(urlparser.parse(url).hostname, async(err, address) => {
    if(!address) {
      res.json({ error: 'invalid url'})
    } else {
      const urlCount = await urls.countDocuments({})
      const urlDoc = {
        url,
        short_url: urlCount
      }

      const result = await urls.insertOne(urlDoc)
      res.json({ original_url: url, short_url: urlCount})
    }
  })
});

app.get('/api/shorturl/:short_url', async (req, res) => {
  const shortUrl = req.params.short_url
  const urlDoc = await urls.findOne({ short_url: shortUrl})
  res.redirect(urlDoc.url)
})

// // In-memory database to store shortened URLs
// const urlDatabase = {};
// let counter = 1;

// // Endpoint to shorten a URL
// app.post('/api/shorturl', (req, res) => {
//   // const originalUrl = req.body.original_url;
//   const { originalUrl } = req.body

//   if (!validUrl.isWebUri(originalUrl)) {
//     return res.status(400).json({ error: 'invalid url' });
//   }

//   const shortUrl = counter++;
//   urlDatabase[shortUrl] = originalUrl;

//   res.json({
//     original_url: originalUrl,
//     short_url: shortUrl
//   });
// });

// app.get('/api/shorturl/:short_url', (req, res) => {
//   const shortUrl = parseInt(req.params.short_url);

//   if (urlDatabase.hasOwnProperty(shortUrl)) {
//     return res.redirect(urlDatabase[shortUrl]);
//   } else {
//     return res.status(404).json({ error: 'short url not found' });
//   }
// });


/**
 * You can POST a URL to /api/shorturl and get a JSON response with original_url and short_url properties.
  Here's an example: { original_url : 'https://freeCodeCamp.org', short_url : 1}
  
 * When you visit /api/shorturl/<short_url>, you will be redirected to the original URL.
 * If you pass an invalid URL that doesn't follow the valid http://www.example.com format, the JSON response will contain { error: 'invalid url' }
 
 */



app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
