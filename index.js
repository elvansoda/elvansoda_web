//index.js

var express = require('express');
var app = express();
var mysql = require('mysql');
var mysql_data = require('./config.js');
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));

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
	var name = req.body.name;
	console.log(name);
/*
var name = req.body.name;
	var fp = req.body.FingerPrint;

    //SQL문 실행
    console.log('Connection to the /list sensored.');
    connection.query("INSERT INTO customer(CustomerName, FingerPrint) VALUES ('"+ name + "', '" + fp + "');", function(err, rows, fields) {
    	if(err){
    		console.log('Error occured! ', err);
    		res.send("There's no data you requested.");
    	}
    	else{
    		console.log('Data is: ', rows);
    		res.json(rows);
    	}
    });
 */	
});

app.post('/manager/stocks/add', function(req, res) {
	console.log('Connection to the /manager/stocks sensored.');
	
	//재고 확인
	var state = req.body.state;
	var stockname = req.body.stockname;
	var stocks = req.body.stocks;
	var adultTF = req.body.tf;
	var price = req.body.price;
	var num = req.body.num;
	
	if(state == "INSERT")
	{
		connection.query("INSERT INTO manager VALUES (" + num + ", '" + stockname + "', " + price + ", " + adultTF + ", " + stocks + ");", function(err, rows, fields) {
			if(err) {
				console.log('Error occured! ', err);
				res.send("Failed to insert data into remote database.");
			}
			else {
				connection.query("SELECT * FROM manager;", function(err, rows, fields) {
					if(err) {
						console.log('Error ocured! ', err);
						res.send('Failed to show data from remote database.');
					}
					else {
						console.log('OK');
						res.send(rows);
					}
				})
			}
		});
	}
});

app.get('/manager/stocks', function(req, res) {
	console.log('Connection to /manager/stocks sensored.');

	connection.query("SELECT * FROM manager", function(err, rows, fields) {
		if(err) {
			console.log('Error occured! ', err);
			res.send('Failed to show someti')
		}
		else {
			console.log('OK');
			res.send(rows);
		}
	})
})
connection.on('error', function(error) {console.log(error)});
//connection.end();
