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
const { Socket } = require("dgram");
const i = new Server(server);
const io = i.of("/");

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./src/uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png/;
    const mimetype = fileTypes.test(file.mimetype);
    const extname = fileTypes.test(path.extname(file.originalname));
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb("Error: Only jpeg or jpg or png Acceptable");
  },
});
if (!fs.existsSync("./src")) {
  fs.mkdirSync("./src");
  fs.mkdirSync("./src/uploads");
  fs.mkdirSync("./src/download");
}

app.get("/", (req, res) => {
  res.render("upload");
});

app.post("/", upload.array("avatar"), (req, res) => {

  let abc = req.body.inlineRadioOptions;

  let le = '';
  if (typeof abc === 'string') {
   
      le = abc
    
  }
  if (typeof abc == 'object') {
   
     let cb = "";
   abc.map(v => {
  
    cb += v+'+'
      
   })
    
    let cc = cb.replace(/\W$/, "");

    le = cc && cc ;
  }
 

  
  function up() {
    fs.readdir("./src/uploads", (err, v) => {
      if (err) return console.log(err);

      io.emit("sta", v[0]);

      fs.readFile(`./src/uploads/${v[0]}`, (err, dat) => {
        if (err) return console.log(err);

        Tesseract.recognize(dat, le, {
          logger: (m) => {
            console.log(m);
          },
        }).then(({ data: { text } }) => {

          
          let fil = v[0].replace(/(.png|.jpg|.jpeg)/, ".text");

          io.emit("file", fil);

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
          fs.unlink(`./src/uploads/${v[0]}`, (err) => {
            if (err) {
              console.log(err);
            }
          });
          //call function
          fs.readdir("./src/uploads", (err, v) => {
            if (err) return console.log(err);
            if (v.length !== 0) {
              up();
            }
          });
        });
      });
    });
  }
  //function end
  
  fs.readdir(__dirname, (err, data) => {
    if (err) return console.log({ message: err });
    
 let vv = /\w*(.traineddata)/;
    data.map((v, i) => {
     let va = vv.test(v)
      if (va) {
        fs.unlink(v, (err) => {
          if (err) {
            console.log(err);
          }
        });
      }
     
    });
  
  });
 


  

  up();

  res.render("upload");
});
app.post("/download", (req, res) => {
  var zip = new AdmZip();
  fs.readdir("./src/download", (err, data) => {
    if (err) return console.log(err);
    data.forEach((value) => {
      zip.addLocalFile(`./src/download/${value}`);
      zip.writeZip("./src/files.zip");
      fs.unlink(`./src/download/${value}`, (err) => {
        console.log(err);
      });
    });
    res.download("./src/files.zip");
  });
});

app.delete("/delete", (req, res) => {
  fs.unlink("./src/files.zip", (err) => console.log(err));

  res.redirect("/");
});

app.post("/itemd", (req, res) => {
  let id = req.body.id;

  fs.unlink(`./src/download/${id}`, (err) => {
    if (err) {
      console.log(err);
    }
    res.send(id);
  });
});

app.post("/itemu", (req, res) => {
  let id = req.body.id;

  fs.unlink(`./src/uploads/${id}`, (err) => {
    if (err) {
      console.log(err);
    }
    res.redirect("/");
  });
});

io.on("connection", (socket) => {
  fs.readdir("./src/uploads", (err, file) => {
    if (err) return console.log(err);

    socket.emit("upload", file);
  });

  if (fs.existsSync("./src/download")) {
    fs.readdir("./src/download", (err, data) => {
      if (err) return console.log(err);

      socket.emit("download", data);
    });
  }

  if (fs.existsSync("./src/files.zip")) {
    socket.emit("delete", fs.existsSync("./src/files.zip"));
  }
});
server.listen(3000, () => {
  console.log("connect server:- http://localhost:3000/");
});
