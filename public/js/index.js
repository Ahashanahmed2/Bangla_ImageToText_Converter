let delet = document.querySelector('#delete');

delet.addEventListener('click', (e) => {

  
    axios({
      method: "delete",
      url: "https://bangla-image-to-text-converter.herokuapp.com/delete",
    }).then(() => {
      location.replace("/");
    });
  
})

function itemD(id) {
 
  axios({
    method: "post",
    url: "https://bangla-image-to-text-converter.herokuapp.com/itemd",
    data: { id: id },
  }).then((v) => {
    location.reload();
  });

   
}

async function itemU(id) {
  let data = await axios({
    method: "post",
    url: "https://bangla-image-to-text-converter.herokuapp.com/itemu",
    data: { id: id },
  });
  console.log(data.data);
}