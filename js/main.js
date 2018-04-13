
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
  sampleChildren[i].addEventListener('click', widthToggle);
}
techWriting.classList.add("expand");
techWriting.classList.remove("collapse");
sampleTech.style.cssText = "display: grid !important";

responsiveResponse(width1250px); //Run the function that checks for viewport width.
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

function widthToggle(event) {

    var el = event.target;
    var elParent = el.parentElement;
    var techClassList = techWriting.classList;
    var designClassList = docDesign.classList;
    var pubClassList = pubContent.classList;

    if (elParent.id === techWriting.id || el.id === techWriting.id || el.id === "techTitle") {

        if (techWriting.className.match("collapse")) {
            techClassList.add("expand");
            techClassList.remove("collapse");
            techTitle.classList.remove("rotate")
            designClassList.add("collapse");
            designClassList.remove("expand");
            designTitle.classList.add("rotate");
            pubClassList.add("collapse");
            pubClassList.remove("expand");
            pubTitle.classList.add("rotate");
            sampleTech.style.cssText = "display: grid !important";
            sampleDesign.style.cssText = "display: none !important";
            sampleArticles.style.cssText = "display: none !important";
        }

    } else if (elParent.id === docDesign.id || el.id === docDesign.id || el.id === "designTitle") {

        if (docDesign.className.match("collapse")) {
            designClassList.add("expand");
            designClassList.remove("collapse");
            designTitle.classList.remove("rotate")
            techClassList.add("collapse");
            techClassList.remove("expand");
            techTitle.classList.add("rotate");
            pubClassList.add("collapse");
            pubClassList.remove("expand");
            pubTitle.classList.add("rotate");
            sampleDesign.style.cssText = "display: grid !important";
            sampleTech.style.cssText = "display: none !important";
            sampleArticles.style.cssText = "display: none !important";
        }

    } else if (elParent.id === pubContent.id || el.id === pubContent.id || el.id === "pubTitle") {

        if (pubContent.className.match("collapse")) {
            pubClassList.add("expand");
            pubClassList.remove("collapse");
            pubTitle.classList.remove("rotate")
            techClassList.add("collapse");
            techClassList.remove("expand");
            techTitle.classList.add("rotate");
            designClassList.add("collapse");
            designClassList.remove("expand");
            designTitle.classList.add("rotate");
            sampleArticles.style.cssText = "display: grid !important";
            sampleTech.style.cssText = "display: none !important";
            sampleDesign.style.cssText = "display: none !important";
        }
    } else {

    }
}
