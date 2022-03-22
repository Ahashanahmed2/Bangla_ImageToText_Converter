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
  fs.readdir("./src/uploads", (err, v) => {
    if (err) return console.log(err);

    v.map((value) => {
      fs.readFile(`./src/uploads/${value}`, (err, dat) => {
        if (err) return console.log(err);

        Tesseract.recognize(dat, "ben+ara+urd", {
          logger: (m) => {
            console.log(m);
          },
        }).then(({ data: { text } }) => {
          let fil = value.replace(".jpg", ".text");

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
          fs.unlink(`./src/uploads/${value}`, (err) => {
            if (err) {
              console.log(err);
            }
          });
        });
      });

    });
    
  });
   fs.unlink("ben.traineddata", (err) => {
     if (err) {
       console.log(err);
     }
   });
   fs.unlink("ara.traineddata", (err) => {
     if (err) {
       console.log(err);
     }
   });
   fs.unlink("urd.traineddata", (err) => {
     if (err) {
       console.log(err);
     }
   });
   res.render("upload");
});
app.post("/download", (req, res) => {
  var zip = new AdmZip();
  fs.readdir("./src/download", (err, data) => {
    if (err) return console.log(err);
    data.forEach((value) => {
      zip.addLocalFile(`./src/download/${value}`);
      zip.writeZip("./src/files.zip");
    });
    res.download("./src/files.zip");
  });
});

app.delete("/delete", (req, res) => {
  fs.unlink("./src/files.zip", (err) => console.log(err));

  res.render("upload");
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
    fs.existsSync("./src/files.zip");

    socket.emit("delete", fs.existsSync("./src/files.zip"));
  }
});
server.listen(3000, () => {
  console.log("connect server:- http://localhost:3000/");
});
