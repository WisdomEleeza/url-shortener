require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const dns = require('dns');
const urlparser = require('url');
const { MongoClient } = require('mongodb');

const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

let db;
let urls;

async function connectToMongo() {
  try {
    const client = new MongoClient(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
    console.log('Connected to MongoDB');
    db = client.db('urlshortener');
    urls = db.collection('urls');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
}

// Call the function to connect to MongoDB before starting the server
connectToMongo().then(() => {
  // Your first API endpoint
  app.post('/api/shorturl', async function (req, res) {
    const url = req.body.url;
    const dnslookup = dns.lookup(urlparser.parse(url).hostname, async (err, address) => {
      if (!address) {
        res.json({ error: 'invalid url' });
      } else {
        const urlCount = await urls.countDocuments({});
        const urlDoc = {
          url,
          short_url: urlCount,
        };

        const result = await urls.insertOne(urlDoc);
        res.json({ original_url: url, short_url: urlCount });
      }
    });
  });

app.get('/api/shorturl/:short_url', async (req, res) => {
  const shortUrl = req.params.short_url;
  const urlDoc = await urls.findOne({ short_url: shortUrl });

  if (urlDoc && urlDoc.url) {
    res.redirect(urlDoc.url);
  } else {
    res.status(404).json({ error: 'short url not found' });
  }
});

  // Start the server
  app.listen(port, function () {
    console.log(`Listening on port ${port}`);
  });
});
