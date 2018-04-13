

  $(document).on("click", "#myBtn", () => { 
    console.log(" the scrape btn is clicked");
    fetch("/scrape", {method: "GET"}).then(() => window.location.reload());
  });
  // $.get("/", (req, res) => res.render("index"));

  

  $(document).on("click", "#saveBtn",function(){
    console.log("I clicked a button");
    var thisId = $(this).attr("data-id");
    $.ajax({
      method: "GET",
      url: "/saved/" + thisId,
      data: {
        
      }
    })
    
      // With that done
      .then(function(data) {
        
        console.log(data);
        $("#" + data._id).remove();
        location.reload();


      })
  })

  $(document).on("click", "#savedArticles",function(){
    console.log("I clicked a saved article button");
    $.ajax({
      method: "POST",
      url: "/save" ,
      data: {
        
      }
    })
      // With that done
      .then(function(data) {
        // Log the response
        console.log(data);


      });
  })
  

 
  // Whenever someone clicks a p tag
  $(document).on("click", ".noteBtn",function() {
    console.log("I clicked a note  button");
    // Empty the notes from the note section
     $(".notes").empty();

    var thisId = $(this).attr("data-id");
    console.log(thisId);
    
    var divId= "#"+ $(this).attr("data-id")
    console.log(divId)
  
    // Now make an ajax call for the Article
    $.ajax({
      method: "GET",
      url: "/articles/" + thisId
    })
      // With that done, add the note information to the page
      .then(function(data) {
        console.log(data);
        // The title of the article
        $(divId).append("<h2> The article id is : " + data._id + "</h2>");
        // An input to enter a new title
        $(divId).append("<h3> The old note is : </h3>")
        $(divId).append("<input id='titleinput'  disabled='disabled' name='title' >");
        // A textarea to add a new note body
        $(divId).append("<h3> Enter your new note : </h3>")
        $(divId).append("<textarea id='bodyinput' name='body'></textarea>");
        // A button to submit a new note, with the id of the article saved to it
        $(divId).append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");
        console.log("dataid i s",data._id)
  
        // If there's a note in the article
        if (data.note) {
          // Place the title of the note in the title input
          $("#titleinput").val(data.note.oldNote);
          console.log("old note is ",data.note.oldNote)
          // Place the body of the note in the body textarea
          //$("#bodyinput").val(data.note.newNote);
        }
      });
  });
  
  // When you click the savenote button
  $(document).on("click", "#savenote", function() {
    console.log(" this save is clicked");
    // Grab the id associated with the article from the submit button
    var thisId = $(this).attr("data-id");
  
    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
      method: "POST",
      url: "/articles/" + thisId,
      data: {
        // Value taken from title input
       // oldNote: $("#titleinput").val(),
        // Value taken from note textarea
       oldNote: $("#bodyinput").val()
      }
    })
      // With that done
      .then(function(data) {
        // Log the response
        console.log(data);
        // Empty the notes section
        $(".notes").empty();
      });
  
    // Also, remove the values entered in the input and textarea for note entry
    $("#titleinput").val("");
    $("#bodyinput").val("");
  });

  $(document).on("click","#deleteBtn", function(event) { 
    console.log("delete bt is clicked");
    var thisId = $(this).attr("data-id");
    console.log("this is id",thisId)
    $.ajax({
      method: "DELETE",
      url: "/delete/" + thisId,
    })
      .done(function(data) {
        $("#" + data._id).remove();
        location.reload();
      });
  });


  