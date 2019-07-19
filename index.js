var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mysql = require('mysql');
var mysql_data = require('./config.js');

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

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

var server = app.listen(3000, function() {
	console.log("Express server has started on port 3000")
});

app.use(express.static('public'));
	
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

var Router = require('./router/router')(app);