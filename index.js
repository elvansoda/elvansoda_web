//index.js

var express = require('express');
var app = express();

app.set("views", "view");
app.set("view engine","ejs");
app.use(express.static(__dirname + '/public'));



var port = process.env.PORT || 3000;
app.listen(port, function(){
	console.log('Server on');
});
