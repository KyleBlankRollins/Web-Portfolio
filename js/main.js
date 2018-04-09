
            var techExpand = document.getElementById("techExpand");
            var designExpand = document.getElementById("designExpand");
            var pubExpand = document.getElementById("pubExpand");
            var samples = document.getElementById("samples");
            var expandButton1 = document.getElementById("expandButton1");
            var expandButton2 = document.getElementById("expandButton2");
            var expandButton3 = document.getElementById("expandButton3");

            samples.classList.add('techExpand');
            samples.classList.add('designExpand');
            samples.classList.add('pubExpand');

            function techToggle() {
                samples.classList.toggle('techExpand');

                if (samples.classList.contains('designExpand') || samples.classList.contains('pubExpand')) {
                    samples.classList.remove("designExpand");
                    samples.classList.remove("pubExpand");
                }

                if (techExpand.style.width >= "300px") {
                    expandText1.innerHTML = "See less";
                    expandChevron1.innerHTML = "<";
                }

                // else {
                //     expandText1.innerHTML = "See more";
                //     expandChevron1.innerHTML = ">";
                // }
            }

            function designToggle() {
                samples.classList.toggle('designExpand');

                if (samples.classList.contains('techExpand') || samples.classList.contains('pubExpand')) {
                    samples.classList.remove("techExpand");
                    samples.classList.remove("pubExpand");
                }

                if (expandText2.innerHTML === "See more") {
                    expandText2.innerHTML = "See less";
                    expandChevron2.innerHTML = "<";
                } else {
                    expandText2.innerHTML = "See more";
                    expandChevron2.innerHTML = ">";
                }

            }

            function pubToggle() {
                samples.classList.toggle('pubExpand');

                if (samples.classList.contains('designExpand') || samples.classList.contains('techExpand')) {
                    samples.classList.remove("designExpand");
                    samples.classList.remove("techExpand");
                }

                if (expandText3.innerHTML === "See more") {
                    expandText3.innerHTML = "See less";
                    expandChevron3.innerHTML = "<";
                } else {
                    expandText3.innerHTML = "See more";
                    expandChevron3.innerHTML = ">";
                }
            }

            techExpand.addEventListener('click', techToggle);
            designExpand.addEventListener('click', designToggle);
            pubExpand.addEventListener('click', pubToggle);
