$( document ).ready(function() {

deleteArticles()

function deleteArticles () {
  console.log("Deleting old articles")
  $.ajax({
    method: "DELETE",
    url: "/remove"
  }).then(function (data) {
    scrapeArticles()
  })
}

function scrapeArticles () {
  console.log("Scraping new articles")
  $.ajax({
    method: "GET",
    url: "/scrape"
  }).then(function (data) {
    getArticles()
  })
}

function getArticles () {
  console.log("Retrieving and appending articles")
  $.getJSON("/articles", function (data) {
    for (var i = 0; i < data.length; i++) {
      var newRow = '<div class="row content-box" data-id="' + data[i]._id + '"></div>'
      var newCol = '<div class="col-md-9"></div>'
      var articleId = data[i]._id
      var articleTitle = data[i].title
      var articleLink = data[i].link
  
      $("#articles").append(`
        <div class="row content-box" data-id="${articleId}">
          <div class="row">
            <div class="col-md-12">
              <p class='content-title' data-id='${articleId}'>${articleTitle}</p>
            </div>
            <div class="col-md-12">
              <a class='content-link' href='${articleLink}'>Link To Article</a>
            </div>
          </div>
        </div>
      `)
    }
  });
}


// Click event for adding note
$(document).on("click", "p", function () {
  $("#notes").empty();
  var thisId = $(this).attr("data-id");
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    .then(function (data) {
      console.log(data);
      $("#notes").append("<h2>" + data.title + "</h2>");
      $("#notes").append("<input id='titleinput' name='title' >");
      $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
      $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");

      // Catch previous note
      if (data.note) {
        $("#titleinput").val(data.note.title);
        $("#bodyinput").val(data.note.body);
      }
    });
});

// Click event for saving note
$(document).on("click", "#savenote", function () {
  var thisId = $(this).attr("data-id");
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      title: $("#titleinput").val(),
      body: $("#bodyinput").val()
    }
  })
    .then(function (data) {
      console.log(data);
      $("#notes").empty();
    });
  $("#titleinput").val("");
  $("#bodyinput").val("");
});

});

