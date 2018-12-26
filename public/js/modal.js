$(document).ready(function () {
    //Display article-note-modal
    //Get the notes that are available for this record and display in a modal
    $(".note").on("click", function (event) {
        event.preventDefault();
        var articleId = $(this).parent().parent().parent().attr("data-id");
        console.log("******************");
        console.log("ArticleToSave = "+articleId);
        console.log("******************");
        displayNotesById(articleId);
    });
    /************************************************
     * Return all notes associated with an article Id
     ************************************************/
    function displayNotesById(data){
          $.ajax("/notes/"+data, {
            type: "GET",
            //data: data //Pass the artist object
          })
          .then(function(data){
              //location.replace("/articles");
              console.log("Returned data = " + JSON.stringify(data));
              //Clear data on form first:
              clearModalFormInput();
              date = (data[0].updated);
              if(data[0].note[0]){
                  console.log("Note = "+ data[0].note[0].body);
                //$("#previous-notes-text").val(data[0].note[0].body);
                data[0].note.forEach(function(eachItem){
                    console.log(eachItem);
                    //var $note = $("<input type='text' class='form-control' id='previous-notes-text' placehoder='Enter test' val = ''>");
                    var $note =$("<p>");
                    $note.text(date.substring(0, date.indexOf('T'))+" - "+eachItem.body);
                    //$note.val(date.substring(0, date.indexOf('T'))+" - "+eachItem.body);
                    $("#previous-notes").append($note);
                })
                /*var $note = $("<input type='text' class='form-control' id='previous-notes-text' placehoder='Enter test' val = ''>");
                $note.val(data[0].note[0].body);
                $("#previous-notes").append($note);*/
              }
              else 
              {
                console.log("No notes found!");
                var $note =$("<p>");
                    $note.text("No previous notes found.");
                    //$note.val(date.substring(0, date.indexOf('T'))+" - "+eachItem.body);
                    $("#previous-notes").append($note);
              }
              
              // Show the modal 
              $("#article-note-modal").modal("toggle");

              //create a data-id attribute and place on modal-submit btn
              $("#modal-submit").attr("data-id", data[0]._id);
              $("#modal-submit").attr("data-title", data[0].title);
          })
          .catch(function(error){
              console.log("error = "+error);
          });
    }
    //Wrap the note into a package and send it on its way
    $('#modal-submit').on('click', function (event) {
       var $noteInput =  $('#article-note-text').val();
       var $articleId = $("#modal-submit").data("id");
       var $articleTitle = $("#modal-submit").data("title");
       console.log("Article Note = "+$noteInput+" Article Id = "+$articleId);

       var notePackage = {
           body: $noteInput,
           id: $articleId,
           title: $articleTitle
       };
       //Post notePackage to db
       insertPackage(notePackage);
      });
      
      //Insert notePackage to db
      /***************************************
     * Update more than one articles status
     **************************************/
    function insertPackage(package) {
        //console.log("CREATEPROFILE.js: " + JSON.stringify(artist));
        //$.ajax("/api/create-profile", {
        $.ajax("/insert-note", {
          type: "POST",
          data: package //Pass the artist object
        })
        .then(function(){
            //location.replace("/");
            //clear the textarea in the model:
            clearModalFormInput();
        })
        .catch(function(error){
            console.log("error = "+error);
        });
    } //insertPackage
    function clearModalFormInput(){
        $("#article-note-text").val("");
        $("#previous-notes").empty();
    }
});//document on ready