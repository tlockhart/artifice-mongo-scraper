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

    $(".save").on("click", function (event) {
        event.preventDefault();
        //var articleId = $(this).attr("data-id");
        var articleId = $(this).parent().parent().parent().attr("data-id");
        var articleOldStatus = $(this).parent().parent().parent().attr("data-status");
        var articleNewStatus = saved;
        console.log("******************");
        console.log("ArticleToSave = "+articleId);
        console.log("ArticleOldStatus = "+articleOldStatus);
        console.log("ArticleNewStatus = "+articleNewStatus);
        console.log("******************");
        var data = {
            id: articleId,
            //oldStatus: articleOldStatus,
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
    //Get the notes that are available for this record and display in a modal
    $(".note").on("click", function (event) {
        event.preventDefault();
        //var articleId = $(this).attr("data-id");
        var articleId = $(this).parent().parent().parent().attr("data-id");
        /*var articleOldStatus = $(this).parent().parent().parent().attr("data-status");
        var articleNewStatus = saved;
        console.log("******************");*/
        console.log("ArticleToSave = "+articleId);
        /*console.log("ArticleOldStatus = "+articleOldStatus);
        console.log("ArticleNewStatus = "+articleNewStatus);
        console.log("******************");*/
        /*var data = {
            id: articleId
        }*/
        displayModal(articleId);
    });
    function displayModal(data){
          $.ajax("/notes/"+data, {
            type: "GET",
            //data: data //Pass the artist object
          })
          .then(function(data){
              //location.replace("/articles");
              console.log("Returned data = " + JSON.stringify(data));
              // SET MODAL CONTENT: Grab the result from the AJAX post so that the best match's name and photo are displayed.
              $("#match-name").text("Tony");
              $("#match-img").attr("src", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTxHMZ61_YBq_vUIGkG7MHRA9cSztvgRAMIdGu-i9b0RFb4zLDa_g");

              /*$("#match-name").text(data.name);
              $("#match-img").attr("src", data.photo);*/

              // Show the modal with the best match
              $("#results-modal").modal("toggle");
          })
          .catch(function(error){
              console.log("error = "+error);
          });
    }
});//document on ready