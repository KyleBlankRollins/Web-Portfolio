
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

sampleTech.classList.add("hide");
sampleDesign.classList.add("hide");
sampleArticles.classList.add("hide");
banner.classList.add("hide");
contactIcons.classList.add("hide");

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

function heightToggle(event) { // REVIEW: Is there any way to clean this up? Should be a way and I'm just not thinking of it. Maybe for v1.5 or something.

    var el = event.target;
    var elParent = el.parentElement;
    var techClassList = techWriting.classList;
    var designClassList = docDesign.classList;
    var pubClassList = pubContent.classList;

    if (elParent.id == techWriting.id || el.id == techWriting.id || el.id == "techTitle") {

        if (techWriting.className.match("collapse")) {
            techClassList.add("expand");
            techClassList.remove("collapse");
            techTitle.classList.remove("rotate");
            sampleTech.classList.add("show");
            sampleTech.classList.remove("hide");
            designClassList.add("collapse");
            designClassList.remove("expand");
            designTitle.classList.add("rotate");
            sampleDesign.classList.add("hide");
            sampleDesign.classList.remove("show");
            pubClassList.add("collapse");
            pubClassList.remove("expand");
            pubTitle.classList.add("rotate");
            sampleArticles.classList.add("hide");
            sampleArticles.classList.remove("show");
        }

    } else if (elParent.id == docDesign.id || el.id == docDesign.id || el.id == "designTitle") {

        if (docDesign.className.match("collapse")) {
            designClassList.add("expand");
            designClassList.remove("collapse");
            designTitle.classList.remove("rotate");
            sampleDesign.classList.add("show");
            sampleDesign.classList.remove("hide");
            techClassList.add("collapse");
            techClassList.remove("expand");
            sampleTech.classList.add("hide");
            sampleTech.classList.remove("show");
            techTitle.classList.add("rotate");
            pubClassList.add("collapse");
            pubClassList.remove("expand");
            sampleArticles.classList.add("hide");
            sampleArticles.classList.remove("show");
            pubTitle.classList.add("rotate");
        }

    } else if (elParent.id == pubContent.id || el.id == pubContent.id || el.id == "pubTitle") {

        if (pubContent.className.match("collapse")) {
            pubClassList.add("expand");
            pubClassList.remove("collapse");
            pubTitle.classList.remove("rotate");
            sampleArticles.classList.add("show");
            sampleArticles.classList.remove("hide");
            techClassList.add("collapse");
            techClassList.remove("expand");
            techTitle.classList.add("rotate");
            sampleTech.classList.add("hide");
            sampleTech.classList.remove("show");
            designClassList.add("collapse");
            designClassList.remove("expand");
            designTitle.classList.add("rotate");
            sampleDesign.classList.add("hide");
            sampleDesign.classList.remove("show");
        }
    }
}

//Animate menu icon.
function expandMenu(x) {
    x.classList.toggle("change");
    banner.classList.toggle("hide");
    contactIcons.classList.toggle("hide");
}
