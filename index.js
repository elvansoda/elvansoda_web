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

var json = {
	"target" : '*',
	"table" : 'customer'
}

connection.connect();

function select_query(data) {
	query = "SELECT";
	string = query.concat(" ", JSON.parse(data).target, " ", "FROM ", JSON.parse(data).table, ";");
	console.log(string);
	console.query(string, function(err, results, fields) {
		if(err){
			console.log(err);
		}
		console.log(results);
	});
}

connection.query('SELECT * FROM customer;', function(err, results, fields) {
	if(err){
		console.log(err);
	}
	console.log(results);
});

select_query(json);
/**
 * [description]
 * @param  {[type]} err     [description]
 * @param  {[type]} results [description]
 * @param  {[type]} fields) {	if(err){		console.log(err);	}	console.log(results);} [description]
 * @return {[type]}         [description]
 * connection.query('INSERT INTO customer VALUES ("Minsu", 20);', function(err, results, fields) {
	if(err){
		console.log(err);
	}
	console.log(results);
});
 */
connection.query('DELETE FROM customer WHERE CustomerName = "Minsu";', function(err, results, fields) {
	if(err) {
		console.log(err);
	}
	console.log(results);
});

connection.query('SELECT * FROM customer;', function(err, results, fields) {
	if(err){
		console.log(err);
	}
	console.log(results);
});

app.set("views", "view");
app.set("view engine","ejs");
app.use(express.static(__dirname + '/public'));

var port = process.env.PORT || 3000;

app.listen(port, function(){
	console.log('Server on');
	console.log("Now server are waiting for the client's access...");
});

connection.end();
