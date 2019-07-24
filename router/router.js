module.exports = function(app)
{
	app.get('/payment', (req, res) => {
		res.render('Page1.ejs');
	});

	app.get('/view', (req, res) => {
		console.log("Someone entered /view");
		connection.query('SELECT ProductName, Price, isAdult, StockNum FROM manager', (err, rows, fields) => {
			if(err)	{
				console.log(err);
				res.send('Cannot find data');
			}
			else {
				console.log(rows);
				res.json(rows);
			}
		})
	});

	app.post('/insert', (req, res) => {
		var pName = req.body.ProductName;
		var stocknum = req.body.StockNum;
		var pPrice = req.body.Price;
		var isadult = req.body.isAdult;

		connection.query("SELECT ProductName FROM manager", (err, rows, fields) => {
			if(err) {
				console.log(err);
				res.send('Error occured while loading Database Table!');
			}
			else {
				//JSON 데이터 내에 pName 값이 들어있는지 확인하고 UPDATE나 INSERT 중 하나의 구문을 수행.
				if(JSON.stringify(rows).includes(pName)) updateTable();
				else insertTable();
			}
		});

		function updateTable() {
			var updateStatement = "UPDATE manager SET ".concat(
				"StockNum = StockNum + ", stocknum,	",", 
				"isAdult = ", isadult, ",", 
				"Price = ", pPrice, 
				" WHERE ProductName = '", pName, "';"
			);
			connection.query(updateStatement, (err, rows, fields) => {
				if(err) {
					console.log(err);
					res.send('update failed');
				}
				else {
					console.log(rows);
					connection.query('SELECT ProductName, StockNum, Price, isAdult FROM manager', (err, rows, fiedls) => {
						if(err) {
							console.log(err);
							res.send('show failed');
						}
						else {
							console.log(rows);
							res.json(rows);
						}
					});
				}
			});
		}

		function insertTable() {
			var insertStatement = "INSERT INTO manager(ProductName, Price, isAdult, StockNum) VALUES (".concat(
				"'", pName, "',", 
				pPrice, ",", 
				isadult, ",", 
				stocknum, ");"
			);
			connection.query(insertStatement, (err, rows, fields) => {
				if(err) {
					console.log(err);
					res.send('insert failed');
				}
				else {
					console.log(rows);
					connection.query('SELECT ProductName, StockNum, isAdult, Price FROM manager', (err, rows, fields) => {
						if(err) {
							console.log(err);
							res.send('show failed');
						}
						else {
							console.log(rows);
							res.json(rows);
						}
					});
				}
			});
		}
	});

	app.post('/payment/update', (req, res) => {
		var ProductName = req.body.ProductName;
		var TotalPrice = req.body.TotalPrice;
		
		conenction.query("SELECT ProductName FROM screen", (err, rows, fields) => {
			if(err) {
				console.log(err);
				res.send('Error occured while loading Database Table!');
			}
			else {
				if(JSON.stringify(rows).includes(ProductName)) updateTable();
				else insertTable();
			}
		});

		function updateTable() {
			var updateStatement = "UPDATE screen SET ".concat("ProductName = ", ProductName, ", Amount = Amount + 1, TotalPrice = ", TotalPrice + TotalPrice, " WHERE ProductName = '", ProductName, "';")
			connection.query(updateStatement, (err, rows, fields) => {
				if(err) {
					console.log(err);
					res.send('Error occured while updating screen data!');
				}
				else {
					connection.query('SELECT ProductName, Amount, TotalPrice FROM screen', (err, rows, fields) => {
						if(err) {
							console.log(err);
							res.send('Error occured while loading screen Table');
						}
						else {
							console.log(rows);
							res.json(rows);
						}
					});
				}
			});
		}

		function insertTable() {
			var insertStatement = "INSERT INTO screen(ProductName, Amount, TotalPrice) VALUES(".concat(
				"'",
				ProductName,
				"', ",
				1,
				",",
				TotalPrice,
				");"
			);
			connection.query(insertStatement, (err, rows, fields) => {
				if(err) {
					console.log(err);
					res.send('Error!');
				}
				else {
					connection.query('SELECT ProductName, Amount, TotalPrice FROM screen', (err, rows, fields) => {
						if(err) {
							console.log(err);
							res.send('Error while loading');
						}
						else {
							console.log(rows);
							res.json(rows);
						}
					});
				}
			});
		}
	});

	app.post('/delete', (req, res) => {

	});
}