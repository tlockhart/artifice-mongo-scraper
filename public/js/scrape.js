$(document).ready(function () {
    var unmarked = 0;
    var saved = 1;
    var hidden = 2;

    //Scrape new articles:
    $(".scrape-new").on("click", function (event) {
        //preventDefault Behavior
        event.preventDefault();
        $.get("/scrape", function (data) {
            location.replace("/");
            //console.log("Scraped Data = "+data);
       });
    });//.scrape-new on click

    //set all new articles to hidden
    $(".clear").on("click", function (event) {
        event.preventDefault();
        setArticlesStatus(hidden);
    });

    //set a saved article to new
    $(".delete").on("click", function (event) {
        event.preventDefault();
        var articleId = $(this).parent().parent().parent().attr("data-id");
        /*console.log("******************");
        console.log("ArticleToSave = "+articleId);
        console.log("******************");*/
        setSingleArticleStatus(articleId, unmarked);
    });
    //set all hidden articles to new.
    $(".unhide").on("click", function (event) {
        event.preventDefault();
        setArticlesStatus(unmarked);
    });
   
    /***************************************
     * Update more than one articles status
     **************************************/
    function setArticlesStatus(status) {
        //console.log("CREATEPROFILE.js: " + JSON.stringify(artist));
        $.ajax("/update-articles-status", {
          type: "PUT",
          data: {status: status} //Pass the artist object
        })
        .then(function(){
            location.replace("articles");
        })
        .catch(function(error){
            console.log("error = "+error);
        });
    } //setArticlesStatus

    function setSingleArticleStatus(id, status){
        data = {
            id: id,
            status: status
        }
        $.ajax("/update-single-article", {
            type: "PUT",
            data: data //Pass the artist object
          })
          .then(function(){
              //location.replace("/");
              location.replace("/saved");
          })
          .catch(function(error){
              //console.log("error = "+error);
          });
    }
    
    //change article status to saved
    $(".save").on("click", function (event) {
        event.preventDefault();
        //var articleId = $(this).attr("data-id");
        var articleId = $(this).parent().parent().parent().attr("data-id");
        //var articleOldStatus = $(this).parent().parent().parent().attr("data-status");
        var articleNewStatus = saved;
        /*console.log("******************");
        console.log("ArticleToSave = "+articleId);
        console.log("ArticleOldStatus = "+articleOldStatus);
        console.log("ArticleNewStatus = "+articleNewStatus);
        console.log("******************");*/
        var data = {
            id: articleId,
            status: articleNewStatus
        }
        setSingleArticle(data);
    });

    /***************************************
     * Update the status of a single article
     ***************************************/
    function setSingleArticle(data) {
        $.ajax("/update-single-article", {
          type: "PUT",
          data: data //Pass the artist object
        })
        .then(function(){
            location.replace("/articles");
        })
        .catch(function(error){
            console.log("error = "+error);
        });
    } //setArticlesStatus  
});//document on ready