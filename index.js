//index.js

var express = require('express');
var mysql = require('mysql');
var mysql_data = require('./config.js');
var app = express();
/*
var connection = mysql.createConnection({
	host     : 'us-cdbr-iron-east-02.cleardb.net',
	user     : 'b387ea294ad5d8',
	password : '6c97eafa',
	database : 'heroku_91e7a73ec3ad857'
});
 */
function startConnection() {
	connection = mysql.createConnection(mysql_data);
	connection.connect(function(err) {
		if (err) {
			console.error('CONNECT FAILED', err.code);
			startConnection();
		}
		else
			console.error('CONNECTED');
	});
	connection.on('error', function(err) {
		if (err.fatal)
			startConnection();
	});
}

startConnection();

app.set("views", "view");
app.set("view engine","ejs");
app.use(express.static(__dirname + '/public'));

var port = process.env.PORT || 3000;

app.listen(port, function(){
	console.log("Express server is open on port 3000.");
});

app.get('/list', function (req, res) {
    //SQL문 실행
    console.log('Connection to the /list sensored.');
    connection.query('SELECT * FROM customer', function(err, rows, fields) {
    	if(err){
    		console.log('Error occured! ', err);
    		res.send("There's no data you requested.");
    	}
    	else{
    		console.log('Data is: ', rows);
    		res.json(rows);
    	}
    });

});

connection.on('error', function(error) {console.log(error)});
//connection.end();
