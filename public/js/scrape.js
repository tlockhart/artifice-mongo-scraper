$(document).ready(function () {

    /*$(".scrape-new").on("click", function (event) {
        //preventDefault Behavior
        event.preventDefault();
        $.get("/scrape", function (data) {
            // For each one
        });//display articles
    });//.scrape-new on click*/
    /*$(".clear").on("click", function (event) {
        event.preventDefault();
        // Empty the notes from the note section
        $(".article-container").empty();
    });*/
    var unsaved = 0;
    var saved = 1;
    var deleted = 3;

    $(".clear").on("click", function (event) {
        event.preventDefault();
        setArticlesStatus(deleted);
    });
    $(".unhide").on("click", function (event) {
        event.preventDefault();
        setArticlesStatus(unsaved);
    });
    $(".save").on("click", function (event) {
        event.preventDefault();
        setSingleArticle(saved);
    });
    /***************************************
     * Update more than one articles status
     **************************************/
    function setArticlesStatus(status) {
        //console.log("CREATEPROFILE.js: " + JSON.stringify(artist));
        //$.ajax("/api/create-profile", {
        $.ajax("/update-articles-status", {
          type: "PUT",
          data: {status: status} //Pass the artist object
        })
        .then(function(){
            //location.replace("/");
        })
        .catch(function(error){
            console.log("error = "+error);
        });
    } //setArticlesStatus
    /***************************************
     * Update the status of a single article
     ***************************************/
    function setSingleArticle(status) {
        var articleId = $(this).attr("data-id");
        var articleToSave = $(this).parent().parent().parent();
        $.ajax("/update-single-article", {
          type: "PUT",
          data: {status: status} //Pass the artist object
        })
        .then(function(){
            //location.replace("/");
        })
        .catch(function(error){
            console.log("error = "+error);
        });
    } //setArticlesStatus  
});//document on ready