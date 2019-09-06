const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mysql = require("mysql");
const mysql_data = require("./config.js");
class Database {
  constructor(config) {
    this.connection = mysql.createConnection(config);
  }

  query(sql, args) {
    return new Promise((resolve, reject) => {
      this.connection.query(sql, args, (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });
  }

  close() {
    return new Promise((resolve, reject) => {
      this.connection.end(err => {
        if (err) return reject(err);
        resolve();
      });
    });
  }
}

let database = new Database(mysql_data);

app.set("views", __dirname + "/views");
app.set("view engine", "ejs");
app.engine("html", require("ejs").renderFile);

const port = process.env.PORT || 3000;
var server = app.listen(port, function() {
  console.log("Express server has started on port 3000");
});

const io = require("socket.io").listen(server);
/*
app.use(
  session({
    secret: "!@#$$%%^$&#@@$@",
    resave: false,
    saveUninitialized: true
  })
);
*/
app.use(express.static("public"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var indexRouter = require("./router/indexRouter.js")(app);
app.use("/", indexRouter);

var managerRouter = require("./router/router.js")(app, database, io);
app.use("/manager", managerRouter);

setInterval(() => {
  database.query("SELECT 1").catch(err => {
    console.log(err);
  });
}, 5000);

io.on("connection", socket => {
  let id;
  socket.on("new Access", () => {
    id = socket.id;

    database
      .query("DELETE FROM screen WHERE id > 0;")
      .then(rows => {
        return database.query("SELECT * FROM screen;");
      })
      .then(rows => {
        console.log("data deleted");
        socket.emit("data updated");
      });
  });

  socket.on("clear data", () => {
    database
      .query("DELETE FROM screen WHERE id > 0;")
      .then(rows => {
        return database.query("SELECT * FROM screen;");
      })
      .then(rows => {
        console.log("data deleted");
        socket.broadcast.emit("data clear");
      })
      .catch(err => {
        console.log(err);
      });
  });
});
