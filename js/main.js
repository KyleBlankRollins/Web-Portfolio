
    var techWriting = document.getElementById("techWriting");
    var docDesign = document.getElementById("docDesign");
    var pubContent = document.getElementById("pubContent");
    var sampleTech = document.getElementById("sampleTech");
    var sampleDesign = document.getElementById("sampleDesign");
    var sampleArticles = document.getElementById("sampleArticles");

    techWriting.classList.add("expand");
    docDesign.classList.add("collapse");
    pubContent.classList.add("collapse");
    sampleTech.style.cssText = "display: grid !important";

    techWriting.addEventListener('click', widthToggle);
    docDesign.addEventListener('click', widthToggle);
    pubContent.addEventListener('click', widthToggle);

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
                designClassList.add("collapse");
                designClassList.remove("expand");
                pubClassList.add("collapse");
                pubClassList.remove("expand");
                sampleTech.style.cssText = "display: grid !important";
                sampleDesign.style.cssText = "display: none !important";
                sampleArticles.style.cssText = "display: none !important";
            } else {
                techClassList.add("collapse");
                techClassList.remove("expand");
                sampleTech.style.cssText = "display: none !important";
            }

        } else if (elParent.id === docDesign.id || el.id === docDesign.id || el.id === "designTitle") {

            if (docDesign.className.match("collapse")) {
                designClassList.add("expand");
                designClassList.remove("collapse");
                techClassList.add("collapse");
                techClassList.remove("expand");
                pubClassList.add("collapse");
                pubClassList.remove("expand");
                sampleDesign.style.cssText = "display: grid !important";
                sampleTech.style.cssText = "display: none !important";
                sampleArticles.style.cssText = "display: none !important";
            } else {
                designClassList.add("collapse");
                designClassList.remove("expand");
                sampleDesign.style.cssText = "display: none !important";
            }

        } else if (elParent.id === pubContent.id || el.id === pubContent.id || el.id === "pubTitle") {

            if (pubContent.className.match("collapse")) {
                pubClassList.add("expand");
                pubClassList.remove("collapse");
                techClassList.add("collapse");
                techClassList.remove("expand");
                designClassList.add("collapse");
                designClassList.remove("expand");
                sampleArticles.style.cssText = "display: grid !important";
                sampleTech.style.cssText = "display: none !important";
                sampleDesign.style.cssText = "display: none !important";
            } else {
                pubClassList.add("collapse");
                pubClassList.remove("expand");
                sampleArticles.style.cssText = "display: none !important";
            }
        }
    }
