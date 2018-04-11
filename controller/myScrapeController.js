// Our scraping tool
// Require request and cheerio. This makes the scraping possible
var request = require("request");
var axios = require("axios");
var cheerio = require("cheerio");
var mongoose = require("mongoose");


var db = require("../models/index.js");
// mongoose.connect("mongodb://localhost/myScrapedb");




module.exports = function(app){

  //app.get("/", (req, res) => res.render("index"));

  app.get("/", function(req, res) {

    db.Article.find({})
    .then(function(dbArticle) {
      // If we were able to successfully find Articles, send them back to the client
      console.log(dbArticle);

      var articles={
        articles :dbArticle
      }
       
    res.render("index", articles);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
  });
     
   
  });
  
  app.get("/save", function(req, res) {
    db.Article.find({ savedArticle:true }, function(error, doc) {
      if (error) {
        console.log(error);
      }
      else {
        var hbsArticleObject = {
          articles: doc
        };
        res.render("savedArticle", hbsArticleObject);
      }
    });
  });

  app.get("/scrape", function(req, res) {

    axios.get("http://www.movies.com/movie-news?pn=3").then(function(response) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(response.data);
    var result = {};
   // Now, we grab every h2 within an article tag, and do the following:
    $("li").each(function(i, element) {
      // Save an empty result object
     

      // Add the text and href of every link, and save them as properties of the result object
      result.title = $(this)
      .find("div.details").find("a").text();
      result.text = $(this).find("div.details").find("div.pTag").text();
      result.url = $(this).find("div.image").find("a").attr("href");
      result.img =$(this).find("div.image").find("a").find("img").attr("src")

      // Create a new Article using the `result` object built from scraping
      db.Article.create(result)
        .then(function(dbArticle) {
          // View the added result in the console
          console.log("Scraped Articles: " + scrapedArticles);
          var hbsArticleObject = {
              articles: scrapedArticles
          };
        })
        .catch(function(err) {
          // If an error occurred, send it to the client
           console.log(err)
          //return res.json(" this is th eerror",err);
        });
    });
    // If we were able to successfully scrape and save an Article, send a message to the client
    // res.redirect("/");
   

  });
  res.end();
  //res.render("index", hbsArticleObject);
    });



    // app.get("/scrape", function(req, res) {

    //     axios.get("http://www.echojs.com/").then(function(response) {
    //     // Then, we load that into cheerio and save it to $ for a shorthand selector
    //     var $ = cheerio.load(response.data);
    //     var result = {};
    
    //    // Now, we grab every h2 within an article tag, and do the following:
    //     $("article h2").each(function(i, element) {
    //       // Save an empty result object
      
    //       // Add the text and href of every link, and save them as properties of the result object
    //       result.title = $(this)
    //         .children("a")
    //         .text();
    //       result.text= $(this)
    //         .children("a")
    //         .text();
    //         result.url =$(this)
    //         .children("a")
    //         .attr("href");

      
    //       // Create a new Article using the `result` object built from scraping
    //       db.Article.create(result)
    //         .then(function(dbArticle) {
    //           // View the added result in the console
    //           console.log(dbArticle);
    //           //return res.json(dbArticle);
    //         })
    //         .catch(function(err) {
    //           // If an error occurred, send it to the client
    //           //return res.json(err);
    //           console.log(err);
    //         });
    //     });
    //     // If we were able to successfully scrape and save an Article, send a message to the client
    //         res.send("Scrape Complete");
    //   });
    //   });

      // Route for getting all Articles from the db
// app.get("/", function(req, res) {
//     // Grab every document in the Articles collection
//     db.Article.find({})
//       .then(function(dbArticle) {
//         // If we were able to successfully find Articles, send them back to the client
//         res.json(dbArticle);
//       })
//       .catch(function(err) {
//         // If an error occurred, send it to the client
//         res.json(err);
//       });
//   });

    // Route for grabbing a specific Article by id, populate it with it's note
    app.get("/articles/:id", function(req, res) {
        // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
        db.Article.findOne({ _id: req.params.id })
          // ..and populate all of the notes associated with it
          .populate("note")
          .then(function(dbArticle) {
            // If we were able to successfully find an Article with the given id, send it back to the client
            res.json(dbArticle);
          })
          .catch(function(err) {
            // If an error occurred, send it to the client
            res.json(err);
          });
      });

  // Route for saving/updating an Article's associated Note
  app.post("/articles/:id", function(req, res) {
    // Create a new note and pass the req.body to the entry
    db.Note.create(req.body)
      .then(function(dbNote) {
        // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
        // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
        // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
        return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
      })
      .then(function(dbArticle) {
        // If we were able to successfully update an Article, send it back to the client
        res.json(dbArticle);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });
  app.get("/saved/:id", function(req, res)  { 

    console.log("save path ");

    let articleObject = req.body;

    
    //findOne({url: articleObject.url}). 
    db.Article.findOneAndUpdate({ _id: req.params.id }, { savedArticle: true }, { new: true })

    .then(function(response) {

      if (response === null) { 
        db.Article.create(articleObject).then((response) => console.log(" ")).catch(err => res.json(err));

        
      } 
      //
        res.send("Article Saved");
    }).catch(function(err) {
      res.json(err);
    });

  }); 

  app.get("/api/savedArticles", function(req, res)  {
    // Grab every document in the Articles collection
    db.Article.find({ savedArticle: true}). 
    then(function(data) {
      console.log(data);
      // res.redirect("savedArticle.handelbars");
      //res.json(dbArticle);
        //       for (var i = 0; i < data.length; i++) {
        //   // Display the apropos information on the page
        //   $("#articles").append("<p data-id='" + data[i]._id + "'> <h2>" + data[i].title + "</h2>" + data[i].url +"<br/>"+data[i].text+"<br/> <img id='newimg' src='"+ data[i].img+"'/></p>");
        //   $("#articles").append("<button id ='deleteBtn' data-id='" + data[i]._id + "'>"+"Delete Articles"+"</button>");
        // }
        res.redirect("/");
    }).catch(function(err) {
      
      res.json(err);
    });
  }); 
  

 
// delete by id
app.delete("/delete/:id", function(req, res) {
  //console.log("ID is getting read for delete" + req.params.id);
  console.log("Delete function is ready.");
  db.Article.findOneAndRemove({"_id": req.params.id}, function (err, offer) {
    if (err) {
      console.log("Not able to delete:" + err);
    } else {
      console.log("Able to delete, Yay");
    }
    res.end();
    // location.reload();

    //  res.redirect("/");

    // setTimeout(function(){
    //     },1000)
      
  });
    //  location.reload();

});


};
