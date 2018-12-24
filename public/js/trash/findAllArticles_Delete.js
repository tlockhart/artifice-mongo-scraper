$(document).ready(function(){
    console.log("in GETSAVEDARTICLES ");
    $.get("/", function(getArticles) {
        console.log("********************************");
        //console.log("ARTIST Name = ", name);
        console.log("ARTICLES = ", getArticles);
        console.log("********************************");
        //REQUIRED: MUST USE TO REDIRECT to new view
        //location.replace("/display-add-listing/" + getData.id);
        //});
      });
});//getSavedArticles)   