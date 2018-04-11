var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");



// Require all models
//var db = require("./models/index.js");

var PORT = process.env.PORT || 3000;

var app = express();

// Use morgan logger for logging requests
app.use(logger("dev"));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));
// parse application/json
app.use(bodyParser.json());

// Set Handlebars.
var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/myScrapedb");

// Routes

  // Scrape data from one site and place it into the mongodb db
//   app.get("/scrape", function(req, res) {
//     // Make a request for the news section of `ycombinator`
//     request("http://www.movies.com/movie-news?pn=2", function(error, response, html) {
//       // Load the html body from request into cheerio
//       var $ = cheerio.load(html);
//       // For each element with a "title" class
//       $("li").each(function(i, element) {
//         // Save the text and href of each link enclosed in the current element
//         console.log("I am working");
//         var title = $(element).children("a").text();
//         var text = $(element).find("div.pTag").text();
//        // var img = $(element).parent
  
//         //If this found element had both a title and a link
//         if (title && text) {
//           // Insert the data in the Article db
//           db.Article.create({
//             title: title,
//             text: text
//           },
//           function(err, inserted) {
//             if (err) {
//               // Log the error if one is encountered during the query
//               console.log(err);
//             }
//             else {
//               // Otherwise, log the inserted data
//               //console.log("new movie",inserted);
//               res.send(inserted);
//             }
//           });
//         }
//       });
//     });
  
//     // Send a "Scrape Complete" message to the browser
//     res.send("Scrape Complete");
//   });

require("./controller/myScrapeController.js")(app);

//app.use("/", routes);


  


// Start the server
app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
  });
  
