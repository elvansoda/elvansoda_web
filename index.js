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

var port = process.env.PORT || 3000;
var server = app.listen(port, function() {
	console.log("Express server has started on port 3000")
});

app.use(express.static('public'));
	
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

var indexRouter = require('./router/indexRouter.js')(app);
app.use('/', indexRouter);

var managerRouter = require('./router/router.js')(app);
app.use('/manage', managerRouter);