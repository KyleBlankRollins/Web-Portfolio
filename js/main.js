
            var techWriting = document.getElementById("techWriting");
            var docDesign = document.getElementById("docDesign");
            var pubContent = document.getElementById("pubContent");
            var samples = document.getElementById("samples");
            var sampleTech = document.getElementById("sampleTech");
            var expandButton1 = document.getElementById("expandButton1");
            var expandButton2 = document.getElementById("expandButton2");
            var expandButton3 = document.getElementById("expandButton3");

            techWriting.addEventListener('click', widthToggle);
            docDesign.addEventListener('click', widthToggle);
            pubContent.addEventListener('click', widthToggle);

            function widthToggle(event) {
                event.preventDefault();

                var el = event.target.parentElement;

                console.log(el.id);

                if (el.id === techWriting.id) {
                    techWriting.classList.add("expand");
                    techWriting.classList.remove("collapse");
                    sampleTech.style.display="block"; // TODO: properly hides the content, but making it reappear isn't working.
                    docDesign.classList.add("collapse");
                    docDesign.classList.remove("expand");
                    pubContent.classList.add("collapse");
                    pubContent.classList.remove("expand");
                    console.log(techWriting.classList);
                } else if (el.id === docDesign.id) {
                    techWriting.classList.add("collapse");
                    techWriting.classList.remove("expand");
                    sampleTech.style.display="none";
                    docDesign.classList.add("expand");
                    docDesign.classList.remove("collapse");
                    pubContent.classList.add("collapse");
                    pubContent.classList.remove("expand");
                    console.log(docDesign.classList);
                } else if (el.id === pubContent.id) {
                    techWriting.classList.add("collapse");
                    techWriting.classList.remove("expand");
                    sampleTech.style.display="none";
                    docDesign.classList.add("collapse");
                    docDesign.classList.remove("expand");
                    pubContent.classList.add("expand");
                    pubContent.classList.remove("collapse");
                    console.log(pubContent.classList);
                }

                // if (techWriting.style.width < "25%" && pubContent.style.width < "25%") {
                //     docDesign.classList.toggle("expand");
                // } else if (techWriting.style.width < "25%" && docDesign.style.width < "25%") {
                //     pubContent.classList.toggle("expand");
                // }
            }
