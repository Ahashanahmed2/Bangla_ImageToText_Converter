let delet = document.querySelector('#delete');

delet.addEventListener('click', (e) => {

  
    axios({
      method:'delete',
      url:'/delete'
      
    }).then(() => {
      location.replace('/')
    })
  
})

function itemD(id) {
 
  axios({
      method: "post",
      url: "/itemd",
     data:{id:id}  ,
  }).then(v => {
    location.reload()
  })

   
}

async function itemU(id) {
  let data = await axios({
    method: "post",
    url: "/itemu",
    data: { id: id },
  });
  console.log(data.data);
}