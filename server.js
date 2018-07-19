// DEPENDENCIES
var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");
// var db = require("./models");

var PORT = process.env.PORT || 3000;
var app = express();

// MIDDLEWARE
app.use(logger("dev"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// MONGO DB CONNECTION
// mongoose.connect("mongodb://localhost/star-wars-scraper");

// MLAB CONNECTION
let uri = 'mongodb://admin:admin1@ds243441.mlab.com:43441/heroku_63m73wmw';
mongoose.connect(uri);
let db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function callback() {

  // Create song schema
  let songSchema = mongoose.Schema({
    decade: String,
    artist: String,
    song: String,
    weeksAtOne: Number
  });

  // Store song documents in a collection called "songs"
  let Song = mongoose.model('songs', songSchema);

  // Create seed data
  let seventies = new Song({
    decade: '1970s',
    artist: 'Debby Boone',
    song: 'You Light Up My Life',
    weeksAtOne: 10
  });

  let eighties = new Song({
    decade: '1980s',
    artist: 'Olivia Newton-John',
    song: 'Physical',
    weeksAtOne: 10
  });

  let nineties = new Song({
    decade: '1990s',
    artist: 'Mariah Carey',
    song: 'One Sweet Day',
    weeksAtOne: 16
  });

  /*
   * First we'll add a few songs. Nothing is required to create the
   * songs collection; it is created automatically when we insert.
   */

  let list = [seventies, eighties, nineties]

  Song.insertMany(list).then(() => {

    /*
     * Then we need to give Boyz II Men credit for their contribution
     * to the hit "One Sweet Day".
     */

    return Song.update({ song: 'One Sweet Day'}, { $set: { artist: 'Mariah Carey ft. Boyz II Men'} })

  }).then(() => {

    /*
     * Finally we run a query which returns all the hits that spend 10 or
     * more weeks at number 1.
     */

    return Song.find({ weeksAtOne: { $gte: 10} }).sort({ decade: 1})

  }).then(docs => {

    docs.forEach(doc => {
      console.log(
        'In the ' + doc['decade'] + ', ' + doc['song'] + ' by ' + doc['artist'] +
        ' topped the charts for ' + doc['weeksAtOne'] + ' straight weeks.'
      );
    });

  }).then(() => {

    // Since this is an example, we'll clean up after ourselves.
    return mongoose.connection.db.collection('songs').drop()

  }).then(() => {

    // Only close the connection when your app is terminating
    return mongoose.connection.close()

  }).catch(err => {

    // Log any errors that are thrown in the Promise chain
    console.log(err)

  })
});














// ROUTES
// Scraping route
// app.get("/scrape", function(req, res) {
//   axios.get("https://www.starwars.com/news").then(function(response) {
//     var $ = cheerio.load(response.data);

//     $("h2.cb-title").each(function(i, element) {

//       var result = {};

//       result.title = $(this).children('a').attr('title')
//       result.link = $(this).children('a').attr('href')

//       // Create new Article with result object
//       db.Article.create(result)
//         .then(function(dbArticle) {
//         })
//         .catch(function(err) {
//           return res.json(err);
//         });
//     });
//     res.send("Article Scrape Completed")
//   });
// });

// // Route for removing all documents from colelction
// app.delete("/remove", function(req, res) {
//   console.log("Server Told To Remove")
//   db.Article.deleteMany({})
//     .then(function() {
//       res("articles deleted")
//     })
//     .catch(function(err) {
//       res.json(err)
//     })
// })

// // Route for finding all Articles
// app.get("/articles", function(req, res) {
//   db.Article.find({})
//     .then(function(dbArticle) {
//       res.json(dbArticle);
//     })
//     .catch(function(err) {
//       res.json(err);
//     });
// });

// // Route for finding Article by id
// app.get("/articles/:id", function(req, res) {
//   db.Article.findOne({ _id: req.params.id })
//     .populate("note")
//     .then(function(dbArticle) {
//       res.json(dbArticle);
//     })
//     .catch(function(err) {
//       res.json(err);
//     });
// });

// // Route for updating Article Note
// app.post("/articles/:id", function(req, res) {
//   db.Note.create(req.body)
//     .then(function(dbNote) {
//       return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
//     })
//     .then(function(dbArticle) {
//       res.json(dbArticle);
//     })
//     .catch(function(err) {
//       res.json(err);
//     });
// });

// // Express Server
// app.listen(PORT, function() {
//   console.log("App running on port " + PORT + "!");
// });
