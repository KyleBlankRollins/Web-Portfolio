
var banner = document.getElementById("banner");
var contactIcons = document.getElementById("contact-icons");
var techWriting = document.getElementById("tech-writing");
var docDesign = document.getElementById("doc-design");
var pubContent = document.getElementById("pub-content");
var sampleTech = document.getElementById("sample-tech");
var sampleDesign = document.getElementById("sample-design");
var sampleArticles = document.getElementById("sample-articles");
var paneTitle = document.getElementsByClassName("pane-title");
var techTitle = document.getElementById("tech-title");
var designTitle = document.getElementById("design-title");
var pubTitle = document.getElementById("pub-title");
var samples = document.getElementById("samples");
var sampleChildren = samples.children;
var width768px = window.matchMedia("(max-width: 768px)");

for (i = 0; i < sampleChildren.length; i++) {
  sampleChildren[i].classList.add("collapse");
  sampleChildren[i].addEventListener('click', heightToggle);
}

responsiveResponse(width768px); //Run responsiveResponse, which checks viewport width.
width768px.addListener(responsiveResponse);

function responsiveResponse(viewportWidth, event) { //Checks to see if viewport matches width of width variables.

    if (width768px.matches) {
        for (i = 0; i < paneTitle.length; i++) {
          paneTitle[i].classList.add("rotate");
          techTitle.classList.remove("rotate");
        }
    } else {
        return;
    }
}

function heightToggle(event) {

    var el = event.target;
    var elParent = el.parentElement;
    var techClassList = techWriting.classList;
    var designClassList = docDesign.classList;
    var pubClassList = pubContent.classList;

    if (elParent.id == techWriting.id || el.id == techWriting.id || el.id == "tech-title") {

        techClassList.toggle("collapse");
        sampleTech.classList.toggle("hide");

        if (!designClassList.contains("collapse")) {
            designClassList.toggle("collapse");
            sampleDesign.classList.toggle("hide");
        }

        if (!pubClassList.contains("collapse")) {
            pubClassList.toggle("collapse");
            sampleArticles.classList.toggle("hide");
        }

    } else if (elParent.id == docDesign.id || el.id == docDesign.id || el.id == "design-title") {

        designClassList.toggle("collapse");
        sampleDesign.classList.toggle("hide");

        if (!techClassList.contains("collapse")) {
            techClassList.toggle("collapse");
            sampleTech.classList.toggle("hide");
        }

        if (!pubClassList.contains("collapse")) {
            pubClassList.toggle("collapse");
            sampleArticles.classList.toggle("hide");
        }

    } else if (elParent.id == pubContent.id || el.id == pubContent.id || el.id == "pub-title") {

        pubClassList.toggle("collapse");
        sampleArticles.classList.toggle("hide");

        if (!techClassList.contains("collapse")) {
            techClassList.toggle("collapse");
            sampleTech.classList.toggle("hide");
        }

        if (!designClassList.contains("collapse")) {
            designClassList.toggle("collapse");
            sampleDesign.classList.toggle("hide");
        }
    }
}


//Animate menu icon.
function expandMenu(x) {
    x.classList.toggle("change");
    banner.classList.toggle("hide");
    contactIcons.classList.toggle("hide");
}

//slideshow
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
  var x = document.getElementsByClassName("pub-slides");
  if (n > x.length) {slideIndex = 1}
  if (n < 1) {slideIndex = x.length}
  for (i = 0; i < x.length; i++) {
     x[i].style.display = "none";
  }
  x[slideIndex-1].style.display = "block";
}

//Work history.
var jobTitle1 = document.getElementById('job-title1');
var jobDesc1 = document.getElementById("job-desc1");
var jobTitle2 = document.getElementById('job-title2');
var jobDesc2 = document.getElementById("job-desc2");
var jobTitle3 = document.getElementById('job-title3');
var jobDesc3 = document.getElementById("job-desc3");
var jobTitle4 = document.getElementById('job-title4');
var jobDesc4 = document.getElementById("job-desc4");
var jobTitle5 = document.getElementById('job-title5');
var jobDesc5 = document.getElementById("job-desc5");
var jobTitle6 = document.getElementById('job-title6');
var jobDesc6 = document.getElementById("job-desc6");
var jobTitle = document.getElementsByClassName("job-title");
var jobDesc = document.getElementsByClassName("job-desc");
var jobClick = document.getElementsByClassName("jobClick");

jobDesc1.classList.add('hide');
jobDesc2.classList.add('hide');
jobDesc3.classList.add('hide');
jobDesc4.classList.add('hide');
jobDesc5.classList.add('hide');
jobDesc6.classList.add('hide');

for (i = 0; i < jobTitle.length; i++) {
  jobTitle[i].addEventListener("click", toggleVisibility)
}

for (i = 0; i < jobDesc.length; i++) {
  jobDesc[i].addEventListener("click", toggleVisibility)
}

function toggleVisibility(id) {

    var el = event.target;
    var elParent = el.parentElement; // REVIEW: Is there any way to clean this up? Should be a way and I'm just not thinking of it. Maybe for v1.5 or something.

    if (el.id == "job-title1" || elParent.id == "job-desc1" || el.id == "job-desc1") {
        jobDesc1.classList.toggle('hide');
        jobTitle1.classList.toggle('title-move');
    }

    if (el.id == "job-title2" || elParent.id == "job-desc2" || el.id == "job-desc2") {
        jobDesc2.classList.toggle('hide');
        jobTitle2.classList.toggle('title-move');
    }

    if (el.id == "job-title3" || elParent.id == "job-desc3" || el.id == "job-desc3") {
        jobDesc3.classList.toggle('hide');
        jobTitle3.classList.toggle('title-move');
    }

    if (el.id == "job-title4" || elParent.id == "job-desc4" || el.id == "job-desc4") {
        jobDesc4.classList.toggle('hide');
        jobTitle4.classList.toggle('title-move');
    }

    if (el.id == "job-title5" || elParent.id == "job-desc5" || el.id == "job-desc5") {
        jobDesc5.classList.toggle('hide');
        jobTitle5.classList.toggle('title-move');
    }

    if (el.id == "job-title6" || elParent.id == "job-desc6" || el.id == "job-desc6") {
        jobDesc6.classList.toggle('hide');
        jobTitle6.classList.toggle('title-move');
    }
}
