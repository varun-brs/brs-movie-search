var key = "apikey=3695b132";
var link = "https://www.omdbapi.com/?";
var page = 1;
var name, year;
var blocking = false;
let chathams_blue = "#1A4B84";

$(window).scroll(checkLock);
$("#close").on("click", function () {
  $("#modalCenter").fadeOut();
  clearModal();
});

function showCovers() {
  $("#movies").empty();
  page = 1;
  name = $("#name").val();
  year = $("#year").val();
  addCovers();
}

function checkLock() {
  if (!blocking) addCovers();
}

function addCovers() {
  if (
    $(window).scrollTop() + $(window).height() >=
    $(document).height() - 100
  ) {
    $("#load").attr("style", "");
    blocking = true;
    var api = link;
    nameSeparate = name.split(" ");
    api += "s=";
    for (let index = 0; index < nameSeparate.length; index++) {
      if (index == 0 && nameSeparate.length > 1)
        api += nameSeparate[index] + "+";
      else if (index < nameSeparate.length - 1)
        api += nameSeparate[index] + "+";
      else api += nameSeparate[index];
    }
    if (year != "") api += "&y=" + year;
    api += "&page=" + page + "&" + key;
    $("#load").attr("style", "display:none");
    $.ajax({
      url: api,
      success: function (answer) {
        layoutCovers(answer);
      },
      error: function () {
        console.log("Information could not be obtained");
      },
    });
    $("#load").attr("style", "display:none");
    page++;
  }
}

function layoutCovers(films) {
  $.each(films.Search, function (indice, element) {
    var film = $("<div>");
    film.id = element.imdbID;
    $(film).on("click", () => searchFilm(film.id));
    $(film).attr("class", "card col-12 col-sm-6 col-lg-4");
    var containerCover = $("<div>");
    $(containerCover).attr("id", "imgFilm");
    var cover = $("<img>");
    if (element.Poster != "N/A") $(cover).attr("src", element.Poster);
    else $(cover).attr("src", "assets/img/notFound.jpg");
    $(cover).attr("class", "card-img-top");
    var body = $("<div>");
    $(body).attr(
      "class",
      "card-img-overlay d-flex align-items-center justify-content-center titlefilm"
    );
    $(body).mouseenter(function () {
      $(containerCover).css({ opacity: "0.3", transition: "1s" });
    });
    $(body).mouseleave(function () {
      $(containerCover).css({ opacity: "1", transition: "1s" });
    });
    var title = $("<h5>");
    $(title).attr("class", "card-title");
    $(title).text(element.Title);
    $(containerCover).append(cover);
    $(film).append(containerCover);
    $(body).append(title);
    $(film).append(body);
    $("#movies").append(film);
  });
  blocking = false;
}

function searchFilm(id) {
  var api = link;
  api += "i=" + id;
  api += "&" + key;
  $("#load").attr("style", "");
  $.ajax({
    url: api,
    success: function (answer) {
      layoutModal(answer);
    },
    error: function () {
      console.log("Could not get information");
    },
  });
  $("#load").attr("style", "display:none");
}

function clearModal() {
  $("i").attr("class", "far fa-star");
  $("#genre").text("");
  $("#release").text("");
  $("#director").text("");
  $("#writer").text("");
  $("#actors").text("");
  $("#plot").text("");
  $("#rating").text("");
}

function putStars(imdbRating) {
  var rating = parseInt(imdbRating.split(".")[0]);
  let star = parseInt(rating / 2);
  $("i:lt(" + star + ")").attr("class", "fas fa-star");
  rating % 2 == 1
    ? $("i:eq(" + star + ")").attr("class", "fas fa-star-half-alt")
    : null;
}

function layoutModal(data) {
  $("#modalTitle").text(data.Title);
  if (data.Poster != "N/A") $("#img").attr("src", data.Poster);
  else $("#img").attr("src", "assets/img/notFound.jpg");
  $("#genre").text(data.Genre);
  $("#release").text(data.Released);
  $("#director").text(data.Director);
  $("#writer").text(data.Writer);
  $("#actors").text(data.Actors);
  $("#plot").text(data.Plot);
  $("#numPuntuacion").text(data.imdbRating);
  putStars(data.imdbRating);
  $("#modalCenter").fadeIn();
}
