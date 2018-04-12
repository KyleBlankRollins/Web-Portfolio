
            var jobDesc1 = document.getElementById("description1");
            var jobDesc2 = document.getElementById("description2");
            var jobDesc3 = document.getElementById("description3");
            var jobDesc4 = document.getElementById("description4");
            var jobDesc5 = document.getElementById("description5");
            var jobDesc6 = document.getElementById("description6");

            var jobReveal1 = document.getElementById("jobReveal1");
            var jobReveal2 = document.getElementById("jobReveal2");
            var jobReveal3 = document.getElementById("jobReveal3");
            var jobReveal4 = document.getElementById("jobReveal4");
            var jobReveal5 = document.getElementById("jobReveal5");
            var jobReveal6 = document.getElementById("jobReveal6");

            var jobTitle1 = document.getElementById("jobTitle1");
            var jobTitle2 = document.getElementById("jobTitle2");
            var jobTitle3 = document.getElementById("jobTitle3");
            var jobTitle4 = document.getElementById("jobTitle4");
            var jobTitle5 = document.getElementById("jobTitle5");
            var jobTitle6 = document.getElementById("jobTitle6");

            jobDesc1.classList.add('hide');
            jobDesc2.classList.add('hide');
            jobDesc3.classList.add('hide');
            jobDesc4.classList.add('hide');
            jobDesc5.classList.add('hide');
            jobDesc6.classList.add('hide');

            jobReveal1.addEventListener('click', jobDescToggle1);
            jobReveal2.addEventListener('click', jobDescToggle2);
            jobReveal3.addEventListener('click', jobDescToggle3);
            jobReveal4.addEventListener('click', jobDescToggle4);
            jobReveal5.addEventListener('click', jobDescToggle5);
            jobReveal6.addEventListener('click', jobDescToggle6);

            jobTitle1.addEventListener('click', jobDescToggle1);
            jobTitle2.addEventListener('click', jobDescToggle2);
            jobTitle3.addEventListener('click', jobDescToggle3);
            jobTitle4.addEventListener('click', jobDescToggle4);
            jobTitle5.addEventListener('click', jobDescToggle5);
            jobTitle6.addEventListener('click', jobDescToggle6);

            function jobDescToggle1() {
                jobDesc1.classList.toggle('hide');
                jobTitle1.classList.toggle('titleMove');

                if (jobReveal1.innerHTML === "–") {
                    jobReveal1.innerHTML = "+";
                } else {
                    jobReveal1.innerHTML = "–";
                }
            }

            function jobDescToggle2() {
                jobDesc2.classList.toggle('hide');
                jobTitle2.classList.toggle('titleMove');

                if (jobReveal2.innerHTML === "–") {
                    jobReveal2.innerHTML = "+";
                } else {
                    jobReveal2.innerHTML = "–";
                }
            }

            function jobDescToggle3() {
                jobDesc3.classList.toggle('hide');
                jobTitle3.classList.toggle('titleMove');

                if (jobReveal3.innerHTML === "–") {
                    jobReveal3.innerHTML = "+";
                } else {
                    jobReveal3.innerHTML = "–";
                }
            }

            function jobDescToggle4() {
                jobDesc4.classList.toggle('hide');
                jobTitle4.classList.toggle('titleMove');

                if (jobReveal4.innerHTML === "–") {
                    jobReveal4.innerHTML = "+";
                } else {
                    jobReveal4.innerHTML = "–";
                }
            }

            function jobDescToggle5() {
                jobDesc5.classList.toggle('hide');
                jobTitle5.classList.toggle('titleMove');

                if (jobReveal5.innerHTML === "–") {
                    jobReveal5.innerHTML = "+";
                } else {
                    jobReveal5.innerHTML = "–";
                }
            }

            function jobDescToggle6() {
                jobDesc6.classList.toggle('hide');
                jobTitle6.classList.toggle('titleMove');

                if (jobReveal6.innerHTML === "–") {
                    jobReveal6.innerHTML = "+";
                } else {
                    jobReveal6.innerHTML = "–";
                }
            }
