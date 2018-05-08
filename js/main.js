
var banner = document.getElementById("banner");
var contactIcons = document.getElementById("contactIcons");
var techWriting = document.getElementById("techWriting");
var docDesign = document.getElementById("docDesign");
var pubContent = document.getElementById("pubContent");
var sampleTech = document.getElementById("sampleTech");
var sampleDesign = document.getElementById("sampleDesign");
var sampleArticles = document.getElementById("sampleArticles");
var paneTitle = document.getElementsByClassName("paneTitle");
var techTitle = document.getElementById("techTitle");
var designTitle = document.getElementById("designTitle");
var pubTitle = document.getElementById("pubTitle");
var samples = document.getElementById("samples");
var sampleChildren = samples.children;
var width1250px = window.matchMedia("(max-width: 1250px)");

for (i = 0; i < sampleChildren.length; i++) {
  sampleChildren[i].classList.add("collapse");
  sampleChildren[i].addEventListener('click', heightToggle);
}

responsiveResponse(width1250px); //Run responsiveResponse, which checks viewport width.
width1250px.addListener(responsiveResponse);

function responsiveResponse(viewportWidth, event) { //Checks to see if viewport matches width of width variables.

    if (width1250px.matches) {
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

    if (elParent.id == techWriting.id || el.id == techWriting.id || el.id == "techTitle") {

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

    } else if (elParent.id == docDesign.id || el.id == docDesign.id || el.id == "designTitle") {

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

    } else if (elParent.id == pubContent.id || el.id == pubContent.id || el.id == "pubTitle") {

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
