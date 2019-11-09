const Http = new XMLHttpRequest();
const url_file_info = "https://api.github.com/repos/akazero200/EB-19/contents/selected.json";
const picked_file_info = "https://api.github.com/repos/akazero200/EB-19/contents/picked.json";
var fileInfo;
var file;
var pickedInfo;
var pickedFile;
var pin;
var personID;
var boxClicked = false;



//use a random url ending to prevent caching
function randUrl(url) {
  return url+"?v="+Math.random().toString(12).substring(2, 12);
}

function getFileInfo(callback) {
  Http.open("GET", randUrl(url_file_info), true);
  Http.setRequestHeader("Accept", "application/json");
  Http.send();
  Http.onreadystatechange = function() {
    if (Http.readyState == 4 && Http.status == 200) {
      fileInfo = JSON.parse(Http.responseText);
      getFile(callback);
      console.log(fileInfo);
    }
  }
}

function getFile(callback) {
  Http.open("GET", randUrl(fileInfo.git_url), true);
  Http.setRequestHeader("Accept", "application/json");
  Http.send();
  Http.onreadystatechange = function() {
    if (Http.readyState == 4 && Http.status == 200) {
      console.log(Http.responseText);
      var response = JSON.parse(Http.responseText);
      file = JSON.parse(atob(response.content));
      console.log(file);

      if(typeof callback === "function"){
        callback();
      }
    }
  }
}

function getGET() {
  var $_GET=[];
  window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi,function(a,name,value){$_GET[name]=value;});
  return $_GET;
}


function logon(){
  var pIDselect = document.getElementById('loginNr');
  inputPID = pIDselect.options[pIDselect.selectedIndex].value-1;
  var inputPIN = document.getElementById('loginPIN').value;

  if(file.part[inputPID]== inputPIN){
    personID = inputPID;
    pin = inputPIN;

    console.log("logon success");
    getPickedInfo(getGift);
  }
}


function getGift() {
  var form = document.getElementById('form');
  var giftbox = document.getElementById('giftbox');

  form.classList.add("slide-out-top");

  setTimeout(function() {
    form.hidden = 'true';
    giftbox.removeAttribute('hidden');
  }, 1200);
}

function getNr() {
  if(!boxClicked){
    boxClicked = true;
    console.log("Encoded: "+pickedFile[personID]);
    var nr = atob(pickedFile[personID]);
    console.log("Decoded: "+nr);
    var giftbox = document.getElementById('giftbox');
    var nrfield = document.getElementById('nrfield');
    var outputnr = document.getElementById('nr');
    giftbox.classList.add('slide-bottom');
    nrfield.removeAttribute('hidden');
    outputnr.textContent = nr;
  }
}


function getPickedInfo(callback) {
  Http.open("GET", randUrl(picked_file_info), true);
  Http.setRequestHeader("Accept", "application/json");
  Http.send();
  Http.onreadystatechange = function() {
    if (Http.readyState == 4 && Http.status == 200) {
      pickedInfo = JSON.parse(Http.responseText);
      getPickedFile(callback);
      console.log(pickedInfo);
    }
  }
}

function getPickedFile(callback) {
  Http.open("GET", randUrl(pickedInfo.git_url), true);
  Http.setRequestHeader("Accept", "application/json");
  Http.send();
  Http.onreadystatechange = function() {
    if (Http.readyState == 4 && Http.status == 200) {
      console.log(Http.responseText);
      var response = JSON.parse(Http.responseText);
      pickedFile = JSON.parse(atob(response.content));
      console.log(pickedFile);

      if(typeof callback === "function"){
        callback();
      }
    }
  }
}
