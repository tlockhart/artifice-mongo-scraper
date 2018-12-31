/* eslint-disable no-unused-vars */
//const
const unmarked = 0;
const saved = 1;
const hidden = 2;
    
//dependencies
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("../models");

module.exports = function(app) {
    /***********************************************************
     * Name: insertData
     * Purpose: Insert new articles into the Article collection
    ************************************************************/
    function insertData(data, db, res) {
        //use artifice_db;
        for (var i = 0; i < data.length; i++ )
        {
            //console.log(data[i].title);
            let title = data[i].title;
            let summary = data[i].summary;
            let url = data[i].url;
            let image = data[i].image;
            db.Article.find({"title": title})
            .then(function(doc){
                if(doc.length > 0)
                {
                   // console.log("Story already in db");
                }
                else{
                    //console.log(title);
                    db.Article.create({ "title": title, "summary": summary, "url": url, "image": image })
                }
            })
            .catch(function(error){
                //console.log(error);
            });

            /*******************************************************
             * IMPORTANT: PAGE SHOULD NOT DISPLAY THE DATA UNTIL ALL
             * THE RECORDS HAVE BEEN LOADED INTO THE ARTICLES DB
             * *****************************************************/
            if(i === (data.length-1))
            {
                res.redirect("/articles");
            }
        }//for
        //console.log("Insert Complete"); 
    }//InsertData
    /**************************************************************/
    /*****************
     * ROUTES
     ****************/
    // 1. At the root path, send a simple hello world message to the browser
    app.get("/", function (req, res) {
        //1) Making a request via axios for The Artifice Articles
        axios.get("https://the-artifice.com/").then(function (response) {
            // Load the Response into cheerio and save it to a variable
            // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
            var $ = cheerio.load(response.data);

            // An empty array to save the data that we'll scrape
            var scrapedArticles = [];

            // With cheerio, find each tr element
            $("tr").each(function (i, element) {

                // Save the text of the element in a "title" variable
                var title = $(element).find(".post-info-td").find(".post-info").find("a").find("h2").text();
                var summary = $(element).find(".post-info-td").find(".post-info").find("a").find("p").text();
                var url = $(element).find(".post-info-td").find(".post-info").find("a").attr("href");
                var image = $(element).find(".post-img-td").find(".post-img").find("a").children("img").attr("src");

                /************************************************************************
                 * IMPORTANT: Save new articles to an object For display.  The record's 
                 * status will be set to 0 by default, indicating they have not been saved.
                 * When the save button is clicked the status will be updated to 1 for 
                 * saved.
                 * **********************************************************************/
                if (title !== "") {
                    scrapedArticles.push({
                        title: title,
                        summary: summary,
                        url: url,
                        image: image
                    });//push
                }//if 
            });//each

            /*Log the scrapedArticles once you've looped 
            through each element found with cheerio*/
            /*console.log();
            console.log("SCRAPED ARTICLES  =" + JSON.stringify(scrapedArticles));*/
            var data = {scrapedArticles};
            //console.log(data);

            /**********************************************
             * Insert new articles into articles collection
             * ********************************************/
            insertData(scrapedArticles, db, res);
        })//axios get request
        //res.redirect("/articles");
    });//get index

    //2.Pull new articles from the database and display to screen
    app.get("/articles", function (req, res) {
        db.Article.find({"status": 0})
        .then(function(data){

            //console.log("htmlRoutes.js -/articles: "+data.length);
            if(data.length > 0){
                res.render("index", {articles: data, current: true});
            }
            else{
                //console.log("In else");
                res.render("index");
            }
           
        })
        .catch(function(error){
            //console.log(error);
        });
    }); // /articles route

    //3. Update all articles status
    app.put("/update-articles-status", function(req, res) {
        var newStatus = parseInt(req.body.status);
        var oldStatus = unmarked;

        if(newStatus === hidden)
        {
            oldStatus = unmarked;
        }
        else if(newStatus === unmarked)
        {
            oldStatus = hidden;
        }else if(newStatus === saved)
        {
            oldStatus = unmarked;
        }
        
        //console.log("NEWSTATUS = "+newStatus +", OLDSTATUS = "+oldStatus);
        db.Article.updateMany({"status": oldStatus}, {$set: {"status": newStatus}})
          .then(function() {
            res.render("index");
          })
          // eslint-disable-next-line prettier/prettier
          .catch(function( error ) {
            //console.log("htmlRoutes.js: Could not update status of articles = " + error);
          });
      });// /update-article-status

      //4. Update a singe articles status
      app.put("/update-single-article", function(req, res) {
          var id = req.body.id;
          var status = req.body.status;
          //console.log("ID = "+id +", STATUS = "+status);
          db.Article.findOneAndUpdate({"_id": id}, {$set: {"status": status}})
          .then(function() {
           //console.log("/update-single-article save article");
            res.status(200).send("ok");
          })
          // eslint-disable-next-line prettier/prettier
          .catch(function( error ) {
            //console.log("htmlRoutes.js: Could not update unsaved articles = " + error);
          });
      });

      //5. Display all saved articles
      app.get("/saved", function (req, res) {
        db.Article.find({"status": saved})
        .then(function(data){
            //console.log("htmlRoutes.js -/saved: "+data.length);
            if(data.length > 0){
                res.render("saved", {articles: data, current: true});
            }
            else{
                //console.log("In else");
                res.render("saved");
            }

        })
        .catch(function(error){
            //console.log(error);
        });
    }); //articles route
    
    //6. Display the note and populate it with the data saved.
    app.get("/notes/:id", function(req, res) {
        var id = req.params.id;
        //console.log("NOTES ID = "+id);
        db.Article.find({"_id": id})
        // Specify that we want to populate the retrieved users with any associated notes
        .populate("note")
        .then(function(data){
            //console.log("htmlRoutes.js -/saved: "+data.length);
            if(data.length > 0){
                //send the data back to the front end that called the get
                res.json(data);
            }
            else{
                //console.log("No Notes Found");
            }          
        })
        .catch(function(error){
           //console.log(error);
        });
      });//POST
      //7. Insert new record into the Notes Collection and populate it in the Articles Collection
    app.post("/insert-note", function(req, res) {
        var id = req.body.id;
        var title = req.body.title;
        var body = req.body.body;
        //console.log("NOTES ID = " + id + " body = " + body);

        // Create a new Note in the db
        db.Note.create({ "title": title, "body": body})
            .then(function (dbNote) {
                // If a Note was created successfully, find one User (there's only one) and push the new Article's _id to the Article's `note` array
                // { new: true } tells the query that we want it to return the updated Article -- it returns the original by default
                // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
                return db.Article.findOneAndUpdate({"_id": id}, { $push: { note: dbNote._id } }, { new: true });
            })
            .then(function (dbUser) {
                // If the User was updated successfully, send it back to the client
                res.json(dbUser);
            })
            .catch(function (err) {
                // If an error occurs, send it back to the client
                res.json(err);
            });
      });//POST
      //8. Delete an article note
    app.delete("/delete-note", function (req, res) {
        var id = req.body.id;
        //console.log("In delete note = "+id);
        db.Note.deleteOne({"_id": id})
          .then(function() {
           //console.log("/update-single-article save article");
            res.status(200).send("ok");
          })
          // eslint-disable-next-line prettier/prettier
          .catch(function( error ) {
            //console.log("htmlRoutes.js: Could not update unsaved articles = " + error);
          });
    });//delete
      //9. A GET route for scraping the artifice website, which redirects to "/" in scrape.js"
     app.get("/scrape", function (req, res) {
        /*************************************************************

        // First, tell the console what server.js is doing
        console.log("\n***********************************\n" +
        "Grabbing every thread name and link\n" +
        "from The Artifice:" +
        "\n***********************************\n");
         console.log ("UnSaved Data = "+ JSON.stringify(data));
        console.log("htmlRoutes.js - /scrape : Scrape and DB Query Complete!");*/
        res.status(200).send("ok");
    });//Get /scraper
}; //MODULE EXPORTS