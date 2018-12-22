/* eslint-disable no-unused-vars */
//dependencies
var axios = require("axios");
var cheerio = require("cheerio");
var async = require("async");

//models
//var db = require("../models");

module.exports = function(app, db) {
    /************
     * FUNCTIONS
     ***********/
    /**********************************************************
     * Name: getAllDbArticles
     * Purpose: Return all records in db.
     * Requirement: Must be called first to avoid Async problems
     **********************************************************/
    async function getAllDbArticles() {
        try
        {
            const allStoredArticles = await db.Article.find({});
            console.log("ALLARTICLES = "+ allStoredArticles);
            savedArticles = allStoredArticles;
            console.log("SAVEDARTICLES = "+savedArticles);
            return allStoredArticles;
        }
        catch(err){
        }
    };//getAllDbArticles
    function getArticles(req, res){
        
        /*res.status(200).json({
            message : "you requested index page"
        });*/
    }
    /**********************************************************
     * Name: findUnsavedArticles
     * Purpose: Returns all articles no in the db.
     **********************************************************/
    function getUnsavedArticles(scrapedArticles, savedArticles, cb) {
        var filteredArticles = [];

       /* console.log("************************************");
        console.log("htmlRoutes.js - FilterUnsavedDate: Scraped Data = ", scrapedArticles);
        console.log("************************************");

        console.log("************************************");
        console.log("htmlRoutes.js - FilterUnsavedDate:  Articles in DB = ", savedArticles);
        console.log("************************************");*/

        for(var i = 0; i < savedArticles.length; i++){
          for(var j= 0; j< scrapedArticles.length; j++){
           // console.log("COMPARE : " +"savedArticles Title = "+savedArticles[i].title+" ScrapedArticles = "+scrapedArticles[j].title);
            if(savedArticles[i].title === scrapedArticles[j].title){
              //console.log("htmlRoutes.js: MATCH FOUND");
            }
            else{
              //console.log("htmlRoutes.js: NO MATCH FOUND");
              filteredArticles.push({
                title: scrapedArticles[j].title,
                summary: scrapedArticles[j].summary,
                url: scrapedArticles[j].url
              }); //push
              //console.log("htmlRoutes.js: "+JSON.stringify(newArticles));
            }//else
          }//for scrapedArticles
        }//for articlesIn
        //unsavedArticles = filteredArticles;
        //console.log("htmlRoutes.js - getUnsavedArticles: filteredArticles = "+JSON.stringify(filteredArticles));
        var valToReturn = cb(filteredArticles);
        console.log("Filter Complete"); 
        return valToReturn;
    }//Filter Unsolved Data
    /*************************************************
     * CALLBACK
     * Purpose: Returns data from the called subroutine
     * To delay program execution.
     ************************************************/
    function cb(data){
        console.log("htmlRoutes.js - CALLBACK: DATA = "+JSON.stringify(data));
        return data;
    }//cb
    /***************************************************************
     * Name: getScrapedData
     * Prupose: GEt the Scraped Data from the Website and return it
     ***************************************************************/
        function getScrapedData(cb) {
            //var returnData;
            //1) Making a request via axios for The Artifice Articles
            var scrapedData = axios.get("https://the-artifice.com/").then(function (response) {
                // Load the Response into cheerio and save it to a variable
                // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
                var $ = cheerio.load(response.data);

                // An empty array to save the data that we'll scrape
                var scrapedArticles = [];

                // With cheerio, find each tr with the "title" class
                // (i: iterator. element: the current element)
                $("tr").each(function (i, element) {

                    // Save the text of the element in a "title" variable
                    var title = $(element).find(".post-info-td").find(".post-info").find("a").find("h2").text();
                    var summary = $(element).find(".post-info-td").find(".post-info").find("a").find("p").text();
                    var url = $(element).find(".post-info-td").find(".post-info").find("a").attr("href");
                    var image = $(element).find(".post-img-td").find(".post-img").find("a").children("img").attr("src");

                    // Save these results in an object that we'll push into the scrapedArticles array we defined earlier
                    if (title !== "") {
                        scrapedArticles.push({
                            title: title,
                            summary: summary,
                            url: url,
                            image: image
                        });//push
                    }//if 
                });//each

                // Log the scrapedArticles once you've looped through each of the elements found with cheerio
                console.log("SCRAPED ARTICLES  =" + JSON.stringify(scrapedArticles));
                console.log("SAVED DATABASE ARTICLES  =" + JSON.stringify(savedArticles));
                //data = {scrapedArticles};
                // console.log(data);
                var unsavedArticles = getUnsavedArticles(scrapedArticles, savedArticles, cb);
                console.log("UNSAVED SCRAPED ARTICLES  =" + JSON.stringify(unsavedArticles));
                var returnData = cb(unsavedArticles);
                return returnData;
            })//axios get request
            /*.catch(function(error){
                console.log("Error "+error);
            });//catch*/
            return scrapedData;
        }//getScrapedData
/**************************************************************/  
//NOT WORKIING CODE
/*****************************************************************
 ** Name: insertData
 ** Purpose: Insert unsaved articles into the collections database
 ****************************************************************/
    function insertData(data, db, collections) {
        //use artifice_db;
        for (var i = 0; i < data.length; i++ )
        {
            //console.log(data[i].title);
            let title = data[i].title;
            let summary = data[i].summary;
            let url = data[i].url;
            let image = data[i].image;
            db.articles.find({"title": title}, function(error, doc){
                //console.log(title);
                if(doc.length > 0)
                {
                console.log("Story already in db");
                }
                else{
                console.log(title);
                db.Article.insert({ "title": title, "summary": summary, "url": url, "image": image })
                }
                //console.log(doc);
            });
        }//for
        console.log("Insert Complete"); 
    }//InsertData
       

/********************************************************************/
    //1) Get all the articles in the DB First thing for comparisons:
    //var savedArticles = getArticles();
    //getAllDbArticles();
    //1) Get all the articles in the DB First thing for comparisons:
    var savedArticles;
    console.log("htmlRoutes.js - outside/scrape: savedArticles = "+JSON.stringify(savedArticles));
/*********************************************************************/
    /*****************
     * ROUTES
     ****************/
    // 1. At the root path, send a simple hello world message to the browser
    app.get("/", function (req, res) {
        //1) Get all the articles in the DB First thing for comparisons:
        db.Article.find({})
        .then(function(articles) {
            // If we were able to successfully find Articles, send them back to the client
            console.log("*****************************");
            console.log("ARTICLES = ", articles);
            console.log("*****************************");
            savedArticles = articles; //data
              //console.log("STOREFRONT DATA =" + JSON.stringify(data));
              //return res.render("/", data); //res render
        })
        .catch(function (err) {
                // If an error occurred, send it to the client
                //res.json(err);
        });
        console.log("*****************************");
        console.log("SAVED ARTICLES: ", savedArticles);
        console.log("*****************************");
        //res.send("Hello world");
        //res.render("index", data);
        //res.redirect("/articles");
        res.render("index");
    });//get index

     // A GET route for scraping the artifice website
     app.get("/scrape", function (req, res) {
        /*************************************************************/
        console.log();
        console.log("New Saved Articles = ", savedArticles);
        // First, tell the console what server.js is doing
        console.log("\n***********************************\n" +
        "Grabbing every thread name and link\n" +
        "from The Artifice:" +
        "\n***********************************\n");
         var data = getScrapedData(cb);
         console.log ("UnSaved Data = "+ JSON.stringify(data));
        /*console.log("DATABASE ARTICLES  ="+savedArticles);*/
        console.log("htmlRoutes.js - /scrape : Scrape and DB Query Complete!");
        res.render("index", data);
    
    });//Get /scraper
     /****************************************************************************/
  

   /* // gets unsaved, unhidden articles from db and displays them
    app.get("/articles", function (req, res) {
        db.Article.find({ "status": 0 }, function (err, data) {
            if (err) {
                console.log(err);
            } else {
                res.render("index", { articles: data, current: true });
            }//else
        });//find
    });//get articles

  // 2. At the "/all" path, display every entry in the articles collection
  app.get("/all", function (req, res) {
    // Query: In our database, go to the articles collection, then "find" everything
    db.Article.find({}, function (error, found) {
      // Log any errors if the server encounters one
      if (error) {
        console.log(error);
      }
      // Otherwise, send the result of this query to the browser
      else {
        res.json(found);
      }//else
    });//find
  });//get all

  // 3. At the "/title" path, display every entry in the articles collection, sorted by name
  app.get("/title", function (req, res) {
    // Query: In our database, go to the articles collection, then "find" everything,
    // but this time, sort it by title (1 means ascending order)
    db.Article.find().sort({ title: 1 }, function (error, found) {
      // Log any errors if the server encounters one
      if (error) {
        console.log(error);
      }
      // Otherwise, send the result of this query to the browser
      else {
        res.json(found);
      }
    });
  });

  // 4. At the "/summary" path, display every entry in the articles collection, sorted by weight
  app.get("/summary", function (req, res) {
    // Query: In our database, go to the articles collection, then "find" everything,
    // but this time, sort it by weight (-1 means descending order)
    db.Article.find().sort({ summary: -1 }, function (error, found) {
      // Log any errors if the server encounters one
      if (error) {
        console.log(error);
      }
      // Otherwise, send the result of this query to the browser
      else {
        res.json(found);
      }
    });
  });//get*/
/****************************************************************************/

}; //MODULE EXPORTS