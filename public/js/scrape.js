$(document).ready(function () {

    $(".scrape-new").on("click", function (event) {
        //preventDefault Behavior
        event.preventDefault();
        $.getJSON("/scrape", function (data) {
            // For each one
        });//display articles
    });//.scrape-new on click

    $(".clear").on("click", function (event) {
        event.preventDefault();
        // Empty the notes from the note section
        $(".article-container").empty();
    });
});//document on ready