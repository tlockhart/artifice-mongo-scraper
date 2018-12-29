/************
     * FUNCTIONS
     ***********/
    /**********************************************************
     * Name: getAllDbArticles
     * Purpose: Return all records in db.
     * Requirement: Must be called first to avoid Async problems
     **********************************************************/
    function getAllDbArticles(){
        //db Fetch
        
        var allStoredArticles = 
            db.Article.find({})
             .then(function(found){
                console.log("htmlRoutes.js - /scrape: savedArticles = "+JSON.stringify(found));
                //savedArticles = found;
                dbReturnVal = found;
                savedArticles = found;
                console.log("SAVED ARTICLES = " +JSON.stringify(found));
                return savedArticles;
             })
             .catch(function (error){
                console.log(error);
             });
        return allStoredArticles;
    }//getAllDbArticles
    /**********************************************************
     * Name: findUnsavedArticles
     * Purpose: Returns all articles no in the db.
     **********************************************************/
    function getUnsavedArticles(scrapedArticles, savedArticles, cb) {
        var filteredArticles = [];

        /*console.log("************************************");
        console.log("htmlRoutes.js - FilterUnsavedDate: Scraped Data = ", scrapedArticles);
        console.log("************************************");

        console.log("************************************");
        console.log("htmlRoutes.js - FilterUnsavedDate:  Articles in DB = ", savedArticles);
        console.log("************************************");*/

        for(var i = 0; i < savedArticles.length; i++){
          for(var j= 0; j< scrapedArticles.length; j++){
            //console.log("COMPARE : " +"savedArticles Title = "+savedArticles[i].title+" ScrapedArticles = "+scrapedArticles[j].title);
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
        //console.log("htmlRoutes.js - CALLBACK: DATA = "+JSON.stringify(data));
        return data;
    }//cb
    /***************************************************************
     * Name: getScrapedData
     * Prupose: GEt the Scraped Data from the Website and return it
     ***************************************************************/
        function getScrapedData() {
            //var returnData;
            //1) Making a request via axios for The Artifice Articles
            axios.get("https://the-artifice.com/").then(function (response) {
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

                    /****************************************
                     * Save scraped articles to an object
                     * For display.  The record's status
                     * will be set to 0 by default, indicating
                     * they have not been saved.  When the save
                     * button is clicked the status will be 
                     * updated to 1 fro saved.
                     * **************************************/
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
                console.log();
                //console.log("SCRAPED ARTICLES  =" + JSON.stringify(scrapedArticles));
                //console.log("SAVED DATABASE ARTICLES  =" + JSON.stringify(savedArticles));
                data = {scrapedArticles};
                console.log(data);

                //Insert data in db:
                insertData(results, db, collections);
                //console.log();
                //var unsavedArticles = getUnsavedArticles(scrapedArticles, savedArticles, cb);
                //console.log("UNSAVED SCRAPED ARTICLES  =" + JSON.stringify(unsavedArticles));
                //var returnData = cb(unsavedArticles);
                //return returnData;
            })//axios get request
            /*.catch(function(error){
                console.log("Error "+error);
            });//catch*/
            //return scrapedData;
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
            db.Article.find({"title": title})
            .then(function(doc){
                if(doc.length > 0)
                {
                    console.log("Story already in db");
                }
                else{
                    console.log(title);
                    db.Article.insert({ "title": title, "summary": summary, "url": url, "image": image })
                }
            })
            .catch(function(error){
                console.log(error);
            });
        }//for
        console.log("Insert Complete"); 
    }//InsertData
       

/********************************************************************/
    //1) Get all the articles in the DB First thing for comparisons:
    var savedArticles;
    getAllDbArticles();
/*********************************************************************/