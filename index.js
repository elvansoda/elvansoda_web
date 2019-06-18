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

connection.query("select * from customer" , 
    	function (error, result, fields) {
            if (error) { //에러 발생시
            	res.send('err : ' + error)
            }
            else { //실행 성공
            	res.send('data : ' + result);
            }
    });
    
app.set("views", "view");
app.set("view engine","ejs");
app.use(express.static(__dirname + '/public'));

var port = process.env.PORT || 3000;

app.listen(port, function(){
	console.log("Express server is open on port 3000.");
});

app.get('/select', function(req, res) {
	console.log("Someone entered in '/select'.");
	connection.query("SELECT * FRO8M customer", function(err, rows, fields) {
		if(!err)
			console.log('The solution is ', rows);
		else
			console.log('Error, ', err);
	});
});

app.get('/list', function (req, res) {
    //SQL문 실행
	    
});


connection.end();
