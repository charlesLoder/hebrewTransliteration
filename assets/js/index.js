const $ = require("jquery");

$(".page-links").hide(); // ensures starts off hidden

$("#nav-arrow").on("click", () => {
  if ($("#nav-arrow").css("transform") === "none") {
    $(".page-links").slideDown(400);
    $("#nav-arrow").css("transform", "rotate(180deg)");
  } else {
    $("#nav-arrow").css("transform", "none");
    $(".page-links").slideUp(400);
  }
});
