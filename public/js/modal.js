$(document).ready(function () {
    //Display article-note-modal
    //Get the notes that are available for this record and display in the modal
    $(".note").on("click", function (event) {
        event.preventDefault();
        //var articleId = $(this).parent().parent().parent().attr("data-id");
        var articleId = $(this).data("id");
        /*console.log("******************");
        console.log("ArticleToSave = "+articleId);
        console.log("******************");*/
        displayNotesById(articleId);
    });
    /************************************************
     * Return all notes associated with an article Id
     ************************************************/
    function displayNotesById(articleId){
          $.ajax("/notes/"+articleId, {
            type: "GET",
          })
          .then(function(data){
              //console.log("Returned data = " + JSON.stringify(data));
              //Clear data on form first:
              clearModalFormInput(articleId);
              
              if(data[0].note[0]){
                /*console.log("Note = "+ data[0].note[0].body);
                console.log("data = "+ JSON.stringify(data));*/
                data[0].note.forEach(function(eachItem){
                    //console.log(eachItem);
                    var $divElem = $('<div>');
                    $divElem.attr("id", "div-"+eachItem._id);
                    $divElem.addClass("row");

                    var date = eachItem.createdAt;
                    var stringDate = date.substring(0,date.indexOf('T'));

                    var $note =$("<p>");
                    $note.attr("id", eachItem._id);
                    $note.text(stringDate+ " - "  +eachItem.body);

                    //$row = $('<div> class = "row"');
                    $col1 = $('<div>');
                    $col1.addClass("col-10");
                    $col2 = $('<div>');
                    $col2.addClass("col-2");

                    $deleteBtn = $('<button type = "button" class = "btn btn-danger delete-note">');
                    $deleteBtn.attr("data-id", eachItem._id);
                    $deleteBtn.html("X");

                    $col1.append($note); 
                    $col2.append($deleteBtn);
                    $divElem.append($col1);
                    $divElem.append($col2);

                    $("#previous-notes-"+data[0]._id).append($divElem);

                    $col1.css('display', 'inline-block');   
                    //$note.css('margin-right', '10px');             
                })
              }
              else 
              {
                  var $note = $("<p>");
                  $note.text("No previous notes found.");
                  //console.log("MODAL.jS: NO NOTES FOUND - ID = "+articleId);
                  $("#previous-notes-" + articleId).append($note);
              }
              // Show the modal 
              $("#article-note-modal-"+articleId).modal("toggle");
          })
          .catch(function(error){
              //console.log("error = "+error);
          });
    }
    //Wrap the note into a package and send it on its way
    $('.modal-submit').on('click', function (event) {
       
       var $articleId = $(this).data("id");
       //console.log("modal.js: $article id = "+$articleId);
       var $noteInput =  $('#article-note-text-'+$articleId).val();
       var $articleTitle = $(this).data("title");
       //console.log("Article Note = "+$noteInput+" Article Id = "+$articleId);

       var notePackage = {
           body: $noteInput,
           id: $articleId,
           title: $articleTitle
       };
       //Display the modal
       $('#article-note-modal-'+$articleId).show();
       var noteIsBlank = false;

       //Note ErrorHandling Routine
        if ($('#article-note-text-'+$articleId).val().trim() === "") {
          noteIsBlank = true;
          //console.log("NOTEISBLANK = "+noteIsBlank);
        }
        if(noteIsBlank){
          $('#article-note-text-'+$articleId).css({ "border-color": "red" });
          $(this).removeAttr('data-dismiss');
          noteIsBlank = false;
        } else {
            $('#article-note-text-'+$articleId).css({ "border-color": "" });
            //Post notePackage to db
            $(this).attr('data-dismiss', "modal");
            insertPackage(notePackage);
        }       
    });

    /***************************************
     * Insert article note in the notes db
     **************************************/
    function insertPackage(package) {
        $.ajax("/insert-note", {
            type: "POST",
            data: package //Pass the artist object
        })
            .then(function (data) {
                //console.log("INSERT Package = "+data);
                //clear the textarea in the model:
                clearModalFormInput(package.id);
            })
            .catch(function (error) {
                console.log("error = " + error);
            });
    } //insertPackage
    function clearModalFormInput(id) {
        //console.log("Clear package = "+id);
        $("#article-note-text-"+id).val("");
        $("#previous-notes-"+id).empty();
    }
    /**************
     * Delete Note
     **************/
    //Delete button not on page during page load, so add listener to closest parent
    //$(".delete-note").on("click", function (event) {
    $(document).on("click", ".delete-note", function(event){
        var $noteId = $(this).data("id");
        /*console.log("IN THE DELETE NODE");
        console.log("BTN ID = "+$noteId);*/
        deleteNote($noteId);
        $("#div-"+$noteId).remove();
    });
    //delete the matching note from the notes collection
    function deleteNote(id){
        $.ajax("/delete-note", {
            type: "DELETE",
            data: {id: id} //Pass the artist object
        })
            .then(function (data) {
                //console.log("DELETE Package = "+data);
            })
            .catch(function (error) {
                console.log("error = " + error);
            });
    } //insertPackage
});//document on ready