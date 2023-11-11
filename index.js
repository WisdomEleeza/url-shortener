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

const mongoose = require('mongoose')

mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true });

var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function() {
  console.log("we're connected!");
});

//Schema n Model
var urlSchema = new mongoose.Schema({
  id: Number,
  url: String
});

var urlModel = mongoose.model("url", urlSchema);

// your first API endpoint...
app.get("/api/hello", function(req, res) {
  res.json({ greeting: "hello API" });
});

app.post("/api/shorturl", function(req, res) {
  let urlRegex = /https:\/\/www.|http:\/\/www./g;
  
  dns.lookup(req.body.url.replace(urlRegex, ""), (err, address, family) => {
    if (err) {
      res.json({"error":"invalid URL"});
    } else {
      urlModel
        .find()
        .exec()
        .then(data => {
          new urlModel({
            id: data.length + 1,
            url: req.body.url
          })
            .save()
            .then(() => {
              res.json({
                original_url: req.body.url,
                short_url: data.length + 1
              });
            })
            .catch(err => {
              res.json(err);
            });
        });
    }
  });
});

app.get("/api/shorturl/:short_url", function(req, res) {
  urlModel
    .find({ id: req.params.number })
    .exec()
    .then(url => {
      res.redirect(url[0]["url"]);
    });
});








app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
