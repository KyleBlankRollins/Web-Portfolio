var slideIndex = 1;
showTechDivs(slideIndex);
showDesignDivs(slideIndex);
showPubDivs(slideIndex);

function plusTechDivs(n) {
  showTechDivs(slideIndex += n);
}

function plusDesignDivs(n) {
  showDesignDivs(slideIndex += n);
}

function plusPubDivs(n) {
  showPubDivs(slideIndex += n);
}

function showTechDivs(n) {
  var i;
  var x = document.getElementsByClassName("techSlides");
  if (n > x.length) {slideIndex = 1}
  if (n < 1) {slideIndex = x.length}
  for (i = 0; i < x.length; i++) {
     x[i].style.display = "none";
  }
  x[slideIndex-1].style.display = "block";
}

function showDesignDivs(n) {
  var i;
  var x = document.getElementsByClassName("designSlides");
  if (n > x.length) {slideIndex = 1}
  if (n < 1) {slideIndex = x.length}
  for (i = 0; i < x.length; i++) {
     x[i].style.display = "none";
  }
  x[slideIndex-1].style.display = "block";
}

function showPubDivs(n) {
  var i;
  var x = document.getElementsByClassName("pubSlides");
  if (n > x.length) {slideIndex = 1}
  if (n < 1) {slideIndex = x.length}
  for (i = 0; i < x.length; i++) {
     x[i].style.display = "none";
  }
  x[slideIndex-1].style.display = "block";
}
