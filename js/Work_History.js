
var jobTitle1 = document.getElementById('job-title1');
var jobDesc1 = document.getElementById("job-desc1");
var jobTitle2 = document.getElementById('job-title2');
var jobDesc2 = document.getElementById("job-desc2");
var jobTitle3 = document.getElementById('job-title3');
var jobDesc3 = document.getElementById("job-desc3");
var jobTitle4 = document.getElementById('job-title4');
var jobDesc4 = document.getElementById("job-desc4");
var jobTitle5 = document.getElementById('job-title5');
var jobDesc5 = document.getElementById("job-desc5");
var jobTitle6 = document.getElementById('job-title6');
var jobDesc6 = document.getElementById("job-desc6");
var jobTitle = document.getElementsByClassName("job-title");
var jobDesc = document.getElementsByClassName("job-desc");
var jobClick = document.getElementsByClassName("jobClick");

jobDesc1.classList.add('hide');
jobDesc2.classList.add('hide');
jobDesc3.classList.add('hide');
jobDesc4.classList.add('hide');
jobDesc5.classList.add('hide');
jobDesc6.classList.add('hide');

for (i = 0; i < jobTitle.length; i++) {
  jobTitle[i].addEventListener("click", toggleVisibility)
}

for (i = 0; i < jobDesc.length; i++) {
  jobDesc[i].addEventListener("click", toggleVisibility)
}

function toggleVisibility(id) {

    var el = event.target;
    var elParent = el.parentElement; // REVIEW: Is there any way to clean this up? Should be a way and I'm just not thinking of it. Maybe for v1.5 or something.

    if (el.id == "job-title1" || elParent.id == "job-desc1" || el.id == "job-desc1") {
        jobDesc1.classList.toggle('hide');
        jobTitle1.classList.toggle('title-move');
    }

    if (el.id == "job-title2" || elParent.id == "job-desc2" || el.id == "job-desc2") {
        jobDesc2.classList.toggle('hide');
        jobTitle2.classList.toggle('title-move');
    }

    if (el.id == "job-title3" || elParent.id == "job-desc3" || el.id == "job-desc3") {
        jobDesc3.classList.toggle('hide');
        jobTitle3.classList.toggle('title-move');
    }

    if (el.id == "job-title4" || elParent.id == "job-desc4" || el.id == "job-desc4") {
        jobDesc4.classList.toggle('hide');
        jobTitle4.classList.toggle('title-move');
    }

    if (el.id == "job-title5" || elParent.id == "job-desc5" || el.id == "job-desc5") {
        jobDesc5.classList.toggle('hide');
        jobTitle5.classList.toggle('title-move');
    }

    if (el.id == "job-title6" || elParent.id == "job-desc6" || el.id == "job-desc6") {
        jobDesc6.classList.toggle('hide');
        jobTitle6.classList.toggle('title-move');
    }
}
