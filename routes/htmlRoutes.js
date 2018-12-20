/* eslint-disable no-unused-vars */
var db = require("../models");

module.exports = function(app, axios, cheerio) {

  function displayScrapes(articles){
    // Query: In our database, go to the articles collection, then "find" everything
    //db.Article.find({})
    //.then(function(dbArticle) {
      // If we were able to successfully find Articles, send them back to the client
      console.log("RENDER ALL ARTICLES IN THE DB");
      /************************************ */
      console.log("htmlRoutes.js: displayScrapes - DATA LENGTH = "+articles.length);
      console.log("htmlRoutes.js: displayScrapes - DBARTICLE = "+ JSON.stringify(articles));
        for (var i = 0; i < articles.length; i++) {
          // Display the apropos information on the page
          //$("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>");
          $articlesIdDiv = $("<div data-id ='" + articles[i].__id + "'" + " class = 'card' >");
          $cardHeader = $("<div class = 'card-header'>");
          $h3 = $("<h3>");
          $articleLink = $("<a class='article-link' target='_blank' rel='nopener noreferrer' href='" + articles[i].url + "'>" + articles[i].title + "</a>");
          $btnSuccess = $("<a class = 'btn btn-success save'>Save Article</a>");
          $cardBody = $("<div class = 'card-body'>" + articles[i].summary + "</div>");
          $h3.append($articleLink);
          $h3.append($btnSuccess);
          $cardHeader.append($h3);
          $articlesIdDiv.append($cardHeader);
          $articlesIdDiv.append($cardBody);
          $(".article-container").append($articlesIdDiv);
        }//for
        /******************************* */
  }
    /****************************************************************************/
  // 1. At the root path, send a simple hello world message to the browser
  /*app.get("/", function (req, res) {
    //res.send("Hello world");
    //res.render("index");
    //res.render("index", data);
  });//get*/

  //2. Scrape articles in the db:
    // A GET route for scraping the echoJS website
    app.get("/scrape", function (req, res) {
        axios.get("https://the-artifice.com/").then(function (response) {
          var results = [];
            // Load the Response into cheerio and save it to a variable
            // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
            var $ = cheerio.load(response.data);

            // With cheerio, find each tr with the "title" class
            // (i: iterator. element: the current element)
            $("tr").each(function (i, element) {
                // Save the text of the element in a "title" variable
                var title = $(element).find(".post-info-td").find(".post-info").find("a").find("h2").text();
                var summary = $(element).find(".post-info-td").find(".post-info").find("a").find("p").text();
                var url = $(element).find(".post-info-td").find(".post-info").find("a").attr("href");

                // Save these results in an object that we'll push into the results array we defined earlier
                if (title !== "") {
                    db.Article.find({ "title": title }, function (error, doc) {
                        //If title already in db
                        if (doc.length > 0) {
                            console.log("htmlRoutes.js: ALREADY STORED in DB - " +title);
                        }
                        //If title not in db push to results array
                        else {
                            console.log("htmlRoutes.js: NEW ARTICLE - " +title);
                            //only push what is not in the database
                            results.push({
                              title: title,
                              summary: summary,
                              url: url
                            });
                        }//else
                    })//db.Article. find titles already in db
                    .then(function (response)
                    {

                    })
                    .catch( function (error){

                    });//find
                }//if 
            });//each
        })//axios
        .then(function (response) 
        {
          // Log the results once you've looped through each of the elements found with cheerio
          console.log("htmlRoutes.js: GET ROUTE - DATA HAS BEEN SCRAPED");
          console.log("htmlRoutes.js: GET ROUTE - RESULTS = ", JSON.stringify(results));
          data = { results };
          console.log("DATA =", data);
          displayScrapes(data);
        })//then
        .catch(function (error) {
          console.log("Error " + error);
        });//catch
      });//get scraper
   


  // 2. At the "/all" path, display every entry in the articles collection
  app.get("/articles", function (req, res) {
    // Query: In our database, go to the articles collection, then "find" everything
    db.Article.find({})
    .then(function(dbArticle) {
      // If we were able to successfully find Articles, send them back to the client
      console.log("RENDER ALL ARTICLES IN THE DB");
      /************************************ */
      console.log("DATA LENGTH = "+dbArticle.length);
      console.log("DBARTICLE = "+ dbArticle);
        for (var i = 0; i < dbArticle.length; i++) {
          // Display the apropos information on the page
          //$("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>");
          $dbArticleIdDiv = $("<div data-id ='" + dbArticle[i].__id + "'" + " class = 'card' >");
          $cardHeader = $("<div class = 'card-header'>");
          $h3 = $("<h3>");
          $articleLink = $("<a class='article-link' target='_blank' rel='nopener noreferrer' href='" + dbArticle[i].url + "'>" + dbArticle[i].title + "</a>");
          $btnSuccess = $("<a class = 'btn btn-success save'>Save Article</a>");
          $cardBody = $("<div class = 'card-body'>" + dbArticle[i].summary + "</div>");
          $h3.append($articleLink);
          $h3.append($btnSuccess);
          $cardHeader.append($h3);
          $dbArticleIdDiv.append($cardHeader);
          $dbArticleIdDiv.append($cardBody);
          $(".article-container").append($dbArticleIdDiv);
        }//for
        /******************************* */
    //res.render("index");
    //res.json(dbArticle);
      //res.render("/", dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err); 
    });
  });//get

  // 3. At the "/title" path, display every entry in the articles collection, sorted by name
  app.get("/title", function (req, res) {
    // Query: In our database, go to the articles collection, then "find" everything,
    // but this time, sort it by title (1 means ascending order)
    db.articles.find().sort({ title: 1 }, function (error, found) {
      // Log any errors if the server encounters one
      if (error) {
        console.log(error);
      }
      // Otherwise, send the result of this query to the browser
      else {
        res.json(found);
      }//else
    });//sort
  });//get

  // 4. At the "/summary" path, display every entry in the articles collection, sorted by weight
  app.get("/summary", function (req, res) {
    // Query: In our database, go to the articles collection, then "find" everything,
    // but this time, sort it by weight (-1 means descending order)
    db.articles.find().sort({ summary: -1 }, function (error, found) {
      // Log any errors if the server encounters one
      if (error) {
        console.log(error);
      }
      // Otherwise, send the result of this query to the browser
      else {
        res.json(found);
      }//else
    });//sort
  });//get
  /**************************************************************************/
  app.get("/save", function (req, res) {
     /********************************/
      //Only Insert when save clicked
    /********************************/
    /*db.Article.create({ "title": result.title, "summary": result.summary, "url": result.url })
        .then(function (dbArticle) {
            // View the added result in the console
            console.log(dbArticle);
        })
        .catch(function (err) {
            // If an error occurred, log it
            console.log(err);
        });//catch*/
    /********************************/
  });
}; //MODULE EXPORTS