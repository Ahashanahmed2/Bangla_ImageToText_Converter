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
    location.replace('/')
  })
  
}

let socket = io("/");

socket.on("upload", (msg) => {
  if (msg.length >= 1) {
    let submitButton = document.querySelector("#submitButton");
    let ll = document.querySelector("#ll");
    submitButton.addEventListener("click", (e) => {
      e.preventDefault();
      submitButton.disabled = true;
       ll.className = "py-2";
      ll.className = "bg-warning"
     
      ll.textContent = "wait for text file Or delete your' UPLOAD FILE '";
      
    });
  }

  let upload = document.querySelector("#upload");

  let up = "<div class='row bg-dark'> "

  msg.forEach((element, index) => {
    up += `<div title="delete File Name:${element}" onclick="if(confirm('item delete ${element} Image ?')== true){ itemU('${element}')}" class='col bg-warning text-dark m-2'>${element}</div>`;
  });

  up += "</div>";
  upload.innerHTML = up;
});

socket.on("download", (m) => {
  let download = document.querySelector("#download");
  let dow = "<div class='row'>";
  m.map((element, index) => {
    let name = element.replace(".text", "");

    dow += `<div title="delete File Name:${element}" onclick="if(confirm('item delete ${element} Image ?')== true){itemD('${element}')}" class='col bg-dark text-light m-1 px-2'><span class='bg-warning text-dark px-2'>${index}</span> <p>${name}</p></div>`;
  });
  dow += "</div>";
  download.innerHTML = dow;
});

socket.on("delete", (d) => {
  let de = document.querySelector("#delete");
  if (d) {
    console.log(d);
    de.innerHTML = `<button class='btn btn-danger text-light p-2'>
              Delete Zip file
            </button>`;
  }
});

socket.on("file", (d) => {
  console.log(d);
  let ss = document.querySelector("#ss");
  ss.style.backgroundColor = "gold"
  let ccc = document.createElement("p");
  ccc.style.padding = "10px";

  ccc.style.margin = "10px 10px 10px 10px";
  ccc.style.backgroundColor = "#000000";

  ccc.style.color = "#ffffff";

ss.appendChild(ccc)
  if (socket.on("upload", (msg) => { 
    msg.length === 0 
  })) {
     let submitButton = document.querySelector("#submitButton");
    let ll = document.querySelector("#ll");
   
    ll.className = "text-warning";
     ll.className = "py-2";
    ll.className = "bg-info";
   
    ll.textContent = 'your file fully .text converted';
    submitButton.disabled = false;
    setTimeout(() => {
      location.replace('/')
    },150000)
  };


  ccc.textContent = d;

});
