
setTimeout(reveal,300);

function reveal () {
    var jobDesc = document.getElementsByClassName('jobDesc')[0];

    document.getElementsByClassName('dropDownBox')[0].onclick = function() {
      if(this.innerHTML === '▼')
      {
        this.innerHTML = '▲';
        jobDesc.classList.add('jobDescShow');
      } else {
        this.innerHTML = '▼';
        var computedStyle = window.getComputedStyle(jobDesc),
            marginLeft = computedStyle.getPropertyValue('margin-left');
        jobDesc.style.marginLeft = marginLeft;
        jobDesc.classList.remove('jobDescShow');
      }
    }
}
