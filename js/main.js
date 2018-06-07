
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
