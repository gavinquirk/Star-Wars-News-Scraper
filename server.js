// DEPENDENCIES
var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");
var db = require("./models");

var PORT = 3000;
var app = express();

// MIDDLEWARE
app.use(logger("dev"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// MONGO DB CONNECTION
mongoose.connect("mongodb://localhost/star-wars-scraper");

// ROUTES

// Scraping route
app.get("/scrape", function(req, res) {
  axios.get("https://www.starwars.com/news").then(function(response) {
    var $ = cheerio.load(response.data);

    $("h2.cb-title").each(function(i, element) {

      var result = {};

      result.title = $(this).children('a').attr('title')
      result.link = $(this).children('a').attr('href')

      // Create new Article with result object
      db.Article.create(result)
        .then(function(dbArticle) {
        })
        .catch(function(err) {
          return res.json(err);
        });
    });
    res.send("Article Scrape Completed")
  });
});

// Route for finding all Articles
app.get("/articles", function(req, res) {
  db.Article.find({})
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

// Route for finding Article by id
app.get("/articles/:id", function(req, res) {
  db.Article.findOne({ _id: req.params.id })
    .populate("note")
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

// Route for updating Article Note
app.post("/articles/:id", function(req, res) {
  db.Note.create(req.body)
    .then(function(dbNote) {
      return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
    })
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

// Express Server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
