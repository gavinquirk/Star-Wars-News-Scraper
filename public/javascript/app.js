$(document).ready(function () {

  // Delete articles, which chains to scrape and get functions
  deleteArticles()

  // Delete all articles from database
  function deleteArticles() {
    console.log("Deleting old articles")
    $.ajax({
      method: "DELETE",
      url: "/remove"
    }).then(function (data) {
      scrapeArticles()
    })
  }

  // Scrape new articles from target website and populate database
  function scrapeArticles() {
    console.log("Scraping new articles")
    $.ajax({
      method: "GET",
      url: "/scrape"
    }).then(function (data) {
      getArticles()
    })
  }

  // Grab articles from database and display onto page
  function getArticles() {
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

  // MODAL ADD NOTE
  $(document).on("click", "p", function () {
    var thisId = $(this).attr("data-id");
    $.ajax({
      method: "GET",
      url: "/articles/" + thisId
    })
      .then(function (data) {
        console.log(data);
        $('#noteModal').modal('show');
        $(".modal-title").empty().append(data.title)
        $('#saveButton').attr('data-id', data._id)

        // Catch previous note
        if (data.note) {
          $(".modal-title").val(data.note.title);
          $("#bodyinput").val(data.note.body);
        }
      });
  });

  // MODAL SAVE NOTE
  $(document).on("click", "#saveButton", function () {
    console.log("Saving")
    var thisId = $(this).attr("data-id");
    console.log(thisId)
    $.ajax({
      method: "POST",
      url: "/articles/" + thisId,
      data: {
        body: $("#bodyinput").val()
      }
    })
      .then(function (data) {
        console.log(data);
      });
      // Clear values and hide modal
    $("#bodyinput").val("");
    $('#noteModal').modal('hide');
  });








// END OF DOCUMENT READY
});

