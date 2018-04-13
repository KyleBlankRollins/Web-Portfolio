
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
    var elParent = el.parentElement;

    console.log(elParent);

    if (el.id == "jobTitle1" || elParent.id == "jobDesc1" || elParent.id == "horizontalUL") {
        jobDesc1.classList.toggle('hide');
        jobTitle1.classList.toggle('titleMove');
    }

    if (el.id == "jobTitle2" || elParent.id == "jobDesc2" || elParent.id == "horizontalUL") {
        jobDesc2.classList.toggle('hide');
        jobTitle2.classList.toggle('titleMove');
    }

    if (el.id == "jobTitle3" || elParent.id == "jobDesc3" || elParent.id == "horizontalUL") {
        jobDesc3.classList.toggle('hide');
        jobTitle3.classList.toggle('titleMove');
    }

    if (el.id == "jobTitle4" || elParent.id == "jobDesc4" || elParent.id == "horizontalUL") {
        jobDesc4.classList.toggle('hide');
        jobTitle4.classList.toggle('titleMove');
    }

    if (el.id == "jobTitle5" || elParent.id == "jobDesc5" || elParent.id == "horizontalUL") {
        jobDesc5.classList.toggle('hide');
        jobTitle5.classList.toggle('titleMove');
    }

    if (el.id == "jobTitle6" || elParent.id == "jobDesc6" || elParent.id == "horizontalUL") {
        jobDesc6.classList.toggle('hide');
        jobTitle6.classList.toggle('titleMove');
    }
}
