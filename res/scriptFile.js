const Http = new XMLHttpRequest();
const url_file_info = "https://api.github.com/repos/akazero200/EB-19/contents/selected.json";
var fileInfo;
var file;
var pin;

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

function fillTable() {
  console.log("filling table");
  const tableBody = document.getElementById('content-table');
  //fill table html elements
  for(i = 0; i < file.selection.length; i++){
    //build one tr
    var tr = document.createElement("tr");
    var th = document.createElement("th");
    th.scope = "row";
    th.textContent = i+1;
    th.classList.add("border-right");
    tr.appendChild(th);

    //fill td elements
    for(k = 0; k< 6; k++){
      var td = document.createElement("td");

      if(k<file.selection[i].ref.length){ //if  there is an entry -> display it; else -> empty td
        td.textContent = file.selection[i].ref[k];
      }
      tr.appendChild(td);
    }
    //append tr and build next
    tableBody.appendChild(tr);
  }
}

//saving input to json file
function saveFile(){
  const personIDTag = document.getElementById('personID');
  const refTags = {
    ref: [
      document.getElementById('ref1'),
      document.getElementById('ref2'),
      document.getElementById('ref3'),
      document.getElementById('ref4'),
      document.getElementById('ref5'),
      document.getElementById('ref6')]
  };

  personID = personIDTag.options[personIDTag.selectedIndex].value-1;

  for(i = 0; i<6; i++){
    file.selection[personID].ref[i] = refTags.ref[i].options[refTags.ref[i].selectedIndex].value;
  }

  uploadFile();
}
function uploadFile() {
  console.log(JSON.stringify(file));
  var encFileContent = btoa(JSON.stringify(file));
  console.log(encFileContent);

  var upload = {
    message: "newly selected",
    sha: fileInfo.sha,
    content: encFileContent,
    committer: { name: "user", email: "example_email@example.com"}
  };

  Http.open("PUT", url_file_info, true);
  Http.setRequestHeader("Accept", "application/json");
  Http.setRequestHeader('Content-Type', "application/json");
  Http.setRequestHeader('Authorization', "token "+getToken());
  Http.send(JSON.stringify(upload));
  Http.onreadystatechange = function() {
    if (Http.readyState == 4 && Http.status == 200) {
      console.log(Http.responseText);
    }
  }
  console.log("upload finished");
}

function addInput(countInput) {
  document.getElementById("groupDiv"+countInput).removeAttribute("hidden");
  if(countInput == 5){
    document.getElementById('addBtn').hidden = "true";
  }
}

function teilnehmen() {
  pin = document.getElementById('pinInput').value;
  if (pin.length==4 && !isNaN(pin)) {
    window.location.href = "teilnahme.html?p="+pin;
  }
}

function storePin() {
  var output = document.getElementById('nrOutput');
  pin = getGET()['p'];
  var newp = true;

  for(i = 0; i < file.part.length; i++){
    if (file.part[i]==pin) {
      newp = false;
    }
  }

  if(newp && pin!=null){
    file.part[file.part.length] = pin;
    var h2 = document.createElement("h2");
    h2.classList.add("display-5");
    h2.textContent = file.part.length
    output.appendChild(h2);

    uploadFile();
  } else {
    var p = document.createElement("p");
    p.textContent = "Dieser PIN ist leider schon vergeben, bitte überlege dir einen anderen und versuche es erneut!"
    output.appendChild(p);
  }
}


function getGET() {
  var $_GET=[];
  window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi,function(a,name,value){$_GET[name]=value;});
  return $_GET;
}

function getNumber(){
  var nrDisplay = document.getElementById('nrDisplay');
  var pin = document.getElementById('pinInput').value;
  var nr = file.part.indexOf(pin);

  if(nr>=0){
    nrDisplay.textContent = "Deine Nr. ist: "+(nr+1);
  } else {
    nrDisplay.textContent = "Gib deinen PIN ein um deine Nummer abzufragen:"
  }
}

function getToken(){
  return atob("YTZlMDE0NmM3OGYyN2U1MGE4MTBjYTljMGI2MDNjNzI2NzQ3ODgzYw==");
}
