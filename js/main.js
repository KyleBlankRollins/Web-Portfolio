
    var techWriting = document.getElementById("techWriting");
    var docDesign = document.getElementById("docDesign");
    var pubContent = document.getElementById("pubContent");
    var samples = document.getElementById("samples");
    var sampleTech = document.getElementById("sampleTech");
    var sampleDesign = document.getElementById("sampleDesign");
    var sampleArticles = document.getElementById("sampleArticles");

    docDesign.classList.add("collapse");
    pubContent.classList.add("collapse");
    sampleTech.style.cssText = "display: grid !important";

    techWriting.addEventListener('click', widthToggle);
    docDesign.addEventListener('click', widthToggle);
    pubContent.addEventListener('click', widthToggle);

    function widthToggle(event) {

        var elParent = event.target.parentElement;
        var el = event.target;
        var techClassList = techWriting.classList;
        var designClassList = docDesign.classList;
        var pubClassList = pubContent.classList;

        if (elParent.id === techWriting.id || el.id === techExpand.id) {

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

        }
        else if (elParent.id === docDesign.id  || el.id === designExpand.id) {

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

        } else if (elParent.id === pubContent.id  || el.id === pubExpand.id) {

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


        // if (elParent.id === techWriting.id || el.id === techExpand.id) {
        //     techWriting.classList.add("expand");
        //     techWriting.classList.remove("collapse");
        //     sampleTech.classList.remove("hide");
        //     sampleDesign.classList.add("hide");
        //     sampleArticles.classList.add("hide");
        //     techOverlay.classList.remove("overlayColumnCollapse");
        //     docDesign.classList.add("collapse");
        //     docDesign.classList.remove("expand");
        //     pubContent.classList.add("collapse");
        //     pubContent.classList.remove("expand");
        //     console.log(techWriting.classList);
        // } else if (elParent.id === docDesign.id  || el.id === designExpand.id) {
        //     techWriting.classList.add("collapse");
        //     techWriting.classList.remove("expand");
        //     sampleTech.classList.add("hide");
        //     sampleDesign.classList.remove("hide");
        //     sampleArticles.classList.add("hide");
        //     techOverlay.classList.add("overlayColumnCollapse");
        //     docDesign.classList.add("expand");
        //     docDesign.classList.remove("collapse");
        //     pubContent.classList.add("collapse");
        //     pubContent.classList.remove("expand");
        //     console.log(docDesign.classList);
        // } else if (elParent.id === pubContent.id  || el.id === pubExpand.id) {
        //     techWriting.classList.add("collapse");
        //     techWriting.classList.remove("expand");
        //     sampleTech.classList.add("hide");
        //     sampleDesign.classList.add("hide");
        //     sampleArticles.classList.remove("hide");
        //     techOverlay.classList.add("overlayColumnCollapse");
        //     docDesign.classList.add("collapse");
        //     docDesign.classList.remove("expand");
        //     pubContent.classList.add("expand");
        //     pubContent.classList.remove("collapse");
        //     console.log(pubContent.classList);
        // }
    }
