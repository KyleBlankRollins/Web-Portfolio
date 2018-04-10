
    var techWriting = document.getElementById("techWriting");
    var docDesign = document.getElementById("docDesign");
    var pubContent = document.getElementById("pubContent");
    var samples = document.getElementById("samples");
    var sampleTech = document.getElementById("sampleTech");
    var sampleTech = document.getElementById("sampleDesign");
    var sampleTech = document.getElementById("sampleArticles");

    var expandButton1 = document.getElementById("expandButton1");
    var expandButton2 = document.getElementById("expandButton2");
    var expandButton3 = document.getElementById("expandButton3");

    techWriting.addEventListener('click', widthToggle);
    docDesign.addEventListener('click', widthToggle);
    pubContent.addEventListener('click', widthToggle);

    function widthToggle(event) {
        event.preventDefault();

        var elParent = event.target.parentElement;
        var el = event.target;
        var i;

        console.log(elParent.id);
        console.log(el.id);

        if (elParent.id === techWriting.id || el.id === techExpand.id) {

            techWriting.classList.add("expand");

        }
        else if (elParent.id === docDesign.id  || el.id === designExpand.id) {

            docDesign.classList.add("expand");

        } else if (elParent.id === pubContent.id  || el.id === pubExpand.id) {

            pubContent.classList.add("expand");

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
