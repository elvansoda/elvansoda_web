//index.js

var express = require('express');
var mysql = require('mysql');
var app = express();

var connection = mysql.createConnection({
  host     : 'us-cdbr-iron-east-02.cleardb.net',
  user     : 'b387ea294ad5d8',
  password : '6c97eafa',
  database : 'heroku_91e7a73ec3ad857'
});

connection.connect();
connection.end();

app.set("views", "view");
app.set("view engine","ejs");
app.use(express.static(__dirname + '/public'));

var port = process.env.PORT || 3000;

app.listen(port, function(){
	console.log('Server on');
	console.log("Now server are waiting for the client's access...");
});

