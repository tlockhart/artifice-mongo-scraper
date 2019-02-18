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
        $.ajax("/update-articles-status", {
          type: "PUT",
          data: {status: status} //Pass the artist object
        })
        .then(function() {
            location.replace("articles");
        })
        .catch(function(error) {
            console.log("error = "+error);
        });
    } //setArticlesStatus

    function setSingleArticleStatus(id, status) {
        data = {
            id: id,
            status: status
        }
        $.ajax("/update-single-article", {
            type: "PUT",
            data: data //Pass the artist object
          })
          .then(function() {
              //location.replace("/");
              location.replace("/saved");
          })
          .catch(function(error) {
              console.log("error = "+error);
          });
    }
    
    //change article status to saved
    $(".save").on("click", function (event) {
        event.preventDefault();
        var articleId = $(this).parent().parent().parent().attr("data-id");
        var articleNewStatus = saved;
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
        .then(function() {
            location.replace("/articles");
        })
        .catch(function(error) {
            console.log("error = "+error);
        });
    } //setArticlesStatus  
});//document on ready