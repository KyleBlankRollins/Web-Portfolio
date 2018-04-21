
var jobTitle1 = document.getElementById('jobTitle1');
var jobDesc1 = document.getElementById("jobDesc1");
var jobTitle2 = document.getElementById('jobTitle2');
var jobDesc2 = document.getElementById("jobDesc2");
var jobTitle3 = document.getElementById('jobTitle3');
var jobDesc3 = document.getElementById("jobDesc3");
var jobTitle4 = document.getElementById('jobTitle4');
var jobDesc4 = document.getElementById("jobDesc4");
var jobTitle5 = document.getElementById('jobTitle5');
var jobDesc5 = document.getElementById("jobDesc5");
var jobTitle6 = document.getElementById('jobTitle6');
var jobDesc6 = document.getElementById("jobDesc6");
var jobTitle = document.getElementsByClassName("jobTitle");
var jobDesc = document.getElementsByClassName("jobDesc");
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

    if (el.id == "jobTitle1" || elParent.id == "jobDesc1" || el.id == "jobDesc1") {
        jobDesc1.classList.toggle('hide');
        jobTitle1.classList.toggle('titleMove');
    }

    if (el.id == "jobTitle2" || elParent.id == "jobDesc2" || el.id == "jobDesc2") {
        jobDesc2.classList.toggle('hide');
        jobTitle2.classList.toggle('titleMove');
    }

    if (el.id == "jobTitle3" || elParent.id == "jobDesc3" || el.id == "jobDesc3") {
        jobDesc3.classList.toggle('hide');
        jobTitle3.classList.toggle('titleMove');
    }

    if (el.id == "jobTitle4" || elParent.id == "jobDesc4" || el.id == "jobDesc4") {
        jobDesc4.classList.toggle('hide');
        jobTitle4.classList.toggle('titleMove');
    }

    if (el.id == "jobTitle5" || elParent.id == "jobDesc5" || el.id == "jobDesc5") {
        jobDesc5.classList.toggle('hide');
        jobTitle5.classList.toggle('titleMove');
    }

    if (el.id == "jobTitle6" || elParent.id == "jobDesc6" || el.id == "jobDesc6") {
        jobDesc6.classList.toggle('hide');
        jobTitle6.classList.toggle('titleMove');
    }
}
