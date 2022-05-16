let delet = document.querySelector("#delete");

delet.addEventListener("click", (e) => {
  axios({
    method: "delete",
    url: "/delete",
  }).then(() => {
    location.replace("/");
  });
});

function itemD(id) {
  axios({
    method: "post",
    url: "/itemd",
    data: { id: id },
  }).then((v) => {
    location.reload();
  });
}

function itemU(id) {
  axios({
    method: "post",
    url: "/itemu",
    data: { id: id },
  }).then(() => {
    location.replace("/");
  });
}

let socket = io("/");

socket.on("upload", (msg) => {
  if (msg.length >= 1) {
    let submitButton = document.querySelector("#submitButton");
    let ll = document.querySelector("#ll");
    submitButton.addEventListener("click", (e) => {
     
      submitButton.disabled = true;
      ll.className = "py-2";
      ll.className = "bg-warning";

      ll.textContent = "Wait for text file Or delete your ' UPLOAD FILE '";
    });
  }

  let upload = document.querySelector("#upload");

  let up = "<div class='row bg-dark'> ";

  msg.forEach((element, index) => {
    up += `<div title="delete File Name:${element}" onclick="if(confirm('item delete ${element} Image ?')== true){ itemU('${element}')}" class='col bg-warning text-dark m-2'><span class="bg-light text-dark p-1 mx-3">${index}</span>${element}</div>`;
  });

  up += "</div>";
  upload.innerHTML = up;
});

socket.on("download", (m) => {
  //download Text File
  let download = document.querySelector("#download");
  let dow = "<div class='row'>";
  m.map((element, index) => {
    let name = element.replace(".text", "");

    dow += `<div title="delete File Name:${element}" onclick="if(confirm('item delete ${element} Image ?')== true){itemD('${element}')}" class='col bg-dark text-light m-1 px-2'><span class='bg-warning text-dark px-2'>${index}</span> <p>${name}</p></div>`;
  });
  dow += "</div>";
  download.innerHTML = dow;

  //download All Text Zip File
  if (m.length > 0) {
    let downloadAllTextZipFile = document.querySelector("#downloadAllTextZipFile");
  downloadAllTextZipFile.innerHTML = `<button class="btn btn-info text-dark p-2">
              Download All text ZIP File
            </button>`;
  
  }


});

socket.on("delete", (d) => {
  let de = document.querySelector("#delete");
  if (d) {
    
    de.innerHTML = `<button class='btn btn-danger text-light p-2'>
              Delete Zip file
            </button>`;
  }
});

socket.on("file", (d) => {

  let ss = document.querySelector("#ss");
  ss.style.backgroundColor = "gold";
  let ccc = document.createElement("p");
  ccc.style.padding = "10px";

  ccc.style.margin = "10px 10px 10px 10px";
  ccc.style.backgroundColor = "#000000";

  ccc.style.color = "#ffffff";

  ss.appendChild(ccc);
  if (
    socket.on("upload", (msg) => {
      msg.length === 0;
    })
  ) {
    let submitButton = document.querySelector("#submitButton");
    let ll = document.querySelector("#ll");
    let startSubject = document.querySelector("#startSubject");
  let sta = document.querySelector("#sta");
startSubject.textContent = "file is fully convert"
    sta.textContent = '';
    ll.className = "text-warning";
    ll.className = "py-2";
    ll.className = "bg-info";

    ll.textContent = "Your file fully .text converted";
    submitButton.disabled = false;
  
  }

  ccc.textContent = d;


});


//start

socket.on("sta", (d) => {
 let ll = document.querySelector("#startSubject");
  let ss = document.querySelector("#sta");
  ss.style.backgroundColor = "gold";
  
  
  ss.style.padding = "10pxss"
  ss.style.margin = "10px 10px 10px 10px";
  ss.style.backgroundColor = "#000000ss"
  ss.style.color = "#ffffff";
  ss.textContent = d;
    ll.className = "text-warning";
    ll.className = "py-2";
    ll.className = "bg-info";
ll.textContent = "file is running"
 


  
});