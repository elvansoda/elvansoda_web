module.exports = function(app)
{
	/*
	pName, stocknum, pPrice, isadult
	*/
	app.get('/payment', (req, res) => {
		res.render('Page1.ejs');
	});

	app.get('/view', (req, res) => {
		console.log("Someone entered /view");
		connection.query('SELECT * FROM manager', (err, rows, fields) => {
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
		var pName = req.body.pName;
		var stocknum = req.body.stockNum;
		var pPrice = req.body.pPrice;
		var isadult = req.body.isadult;

		var inserter = "INSERT INTO manager(ProductName, Price, AdultTF, StockNum) VALUES (";
		var updater = "UPDATE manager SET ";

		var isUpdate;
		console.log(req.body);
		connection.query("SELECT ProductName FROM manager", (err, rows, fields) => {
			if(err) {
				console.log(err);
				res.send('first selection failed');
			}
			else {
				jsonFile = JSON.stringify(rows);
				isUpdate = jsonFile.includes(pName);
				selectMode(isUpdate);
			};
		});
		

		function selectMode(isUpdate) {
			if(isUpdate) {
				var final_updater = updater.concat("StockNum = StockNum + ", stocknum, ",", "AdultTF = ", isadult, ",", "Price = ", pPrice, " WHERE ProductName = ", "'", pName, "';");
				connection.query(final_updater, (err, rows, fields) => {
					if(err) {
						console.log(err);
						res.send('update failed');
					}
					else {
						connection.query('SELECT ProductName, StockNum, Price, AdultTF FROM manager', (err, rows, fiedls) => {
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
			else {
				var final_inserter = inserter.concat("'", pName, "',", pPrice, ",", isadult, ",", stocknum, ");");
				connection.query(final_inserter, (err, rows, fields) => {
					if(err) {
						console.log(err);
						res.send('insert failed');
					}
					else {
						console.log(rows);
						connection.query('SELECT ProductName, StockNum, AdultTF, Price FROM manager', (err, rows, fields) => {
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
		}
	});

	app.post('/payment/update', (req, res) => {
		pName = req.body.pName;

	});
}