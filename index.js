const express = require("express");
const Tesseract = require("tesseract.js");
const AdmZip = require("adm-zip");
const fs = require("fs");
const path = require("path");
const multer = require("multer");

const app = express();
const http = require("http");
const bodyParser = require("body-parser");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./src/uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

app.get("/", (req, res) => {
  if (!fs.existsSync("./src")) {
    fs.mkdirSync("./src");
    fs.mkdirSync("./src/uploads");
    fs.mkdirSync("./src/download");
  }
  res.render("index");
});
app.get("/upload", (req, res) => {
  res.render("upload");
});



app.post("/upload", upload.array("avatar",5), (req, res) => {
  
  fs.readdir("./src/uploads", (err, v) => {
    if (err) return console.log(err);
    if (v.length <= 3) {
      (() => {
        fs.readdir("./src/uploads", (err, dat) => {
          if (err) return console.log(err);
          dat.map((value) => {
            fs.readFile(`./src/uploads/${value}`, (err, dat) => {
              if (err) return console.log(err);

              Tesseract.recognize(dat, "ben", {
                logger: (m) => {
                  let kk = io.of("/upload");
                  setInterval(() => {
                    kk.emit('logg',m)
                  },1000)
           
               
                console.log(m)
                },
              }).then(({ data: { text } }) => {
                let fil = value.replace(".jpg", ".text");
let kk = io.of("/upload");
                  setInterval(() => {
                    kk.emit('file',fil)
                  },1000)
                fs.writeFile(
                  `./src/download/${fil}`,
                  text,
                  { encoding: "utf8" },
                  (err) => {
                    if (err) {
                      console.log(err);
                    }
                  }
                );
                fs.unlink(`./src/uploads/${value}`, (err) => console.log(err));
               
              });
            });

            fs.unlink(`./ben.traineddata`, (err) => {
              console.log(err);
            });
          });
        });
      })();
      res.render("upload")
    } else {
      req.files.map(value => {
       fs.unlink(`./src/uploads/${value.originalname}`,err=>console.log(err))
     })
     res.redirect("/");
    }
  });

 
  
});
app.post("/download", (req, res) => {
  var zip = new AdmZip();
  fs.readdir("./src/download", (err, data) => {
    if (err) return console.log(err);
    data.forEach(value => {
      zip.addLocalFile(`./src/download/${value}`);
        zip.writeZip("./src/files.zip");
       
    })
     res.download("./src/files.zip");
  })
  
  
  
});

app.delete("/delete", (req, res) => {
  
    fs.unlink("./src/files.zip", (err) => console.log(err));
  fs.unlink("./src/download",err=>console.log(err))


  res.render('index');
});

app.post("/itemd", (req, res) => {
  let id = req.body.id;

  fs.unlink(`./src/download/${id}`,err=>{
    if (err) {
      console.log(err)
    }
      res.send(id);
  })

});

app.post("/itemu", (req, res) => {
  let id = req.body.id;

  fs.unlink(`./src/uploads/${id}`, (err) => {
    if (err) {
      console.log(err);
    }
    res.send(id);
  });
});
app.get("/reload", (req, res) => {
  res.redirect('/upload')
})

let kk = io.of("/upload")
kk.on("connection", (socket) => {
 
    fs.readdir("./src/uploads", (err, file) => {
      if (err) return res.send(err);
setTimeout(() => {
   kk.emit("upload", file);
  
}, 10);
     
     
    });
  


  if (fs.existsSync('./src/download')) {
    fs.readdir("./src/download", (err, data) => {
      if (err) return console.log(err)
      
        setTimeout(() => {
          kk.emit("download", data);
        }, 10);
      
    })
  }
  if (fs.existsSync("./src/files.zip")) {
   fs.existsSync("./src/files.zip")
    setTimeout(() => {
      kk.emit("delete", fs.existsSync("./src/files.zip"));
    }, 1000);
  }
});
app.listen(3000, () => console.log("server is connect"));
