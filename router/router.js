module.exports = function(app, database, io) {
  const express = require('express');
  const router = express.Router();

  router.get('/stocks', (req, res) => {
    database
      .query('SELECT Productname, Price, isAdult, StockNum FROM stock')
      .then((rows) => {
        console.log(rows);
        res.json(rows);
      })
      .catch((err) => {
        console.log(err);
        res.send('Cannot find data.');
      });
  });

  router.put('/stocks', (req, res) => {
    database
      .query(
        `INSERT INTO stock(ProductName, Price, isAdult, StockNum) VALUES ('${req.body.ProductName}', ${req.body.Price}, ${req.body.isAdult}, ${req.body.StockNum}) 
        ON DUPLICATE KEY UPDATE ProductName='${req.body.ProductName}', Price=${req.body.Price}, isAdult=${req.body.isAdult}, StockNum=${req.body.StockNum}`,
      )
      .then((result) => {
        res.json(result);
      })
      .catch((err) => {
        console.log(err);
      });
  });

  router.delete('/stocks/:productName', (req, res) => {
    console.log(req.params.productName);
    database
      .query(
        `SELECT Productname FROM stock WHERE Productname='${req.params.productName}';`,
      )
      .then((result) => {
        return database.query(
          `DELETE FROM stock WHERE Productname='${req.params.productName}';`,
        );
      })
      .then((result) => {
        console.log(result);
        res.send(result);
      })
      .catch((err) => {
        console.log(err);
        res.send('No products found.');
      });
  });

  return router;
};
