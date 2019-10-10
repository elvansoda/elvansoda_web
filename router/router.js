module.exports = function(app, database, io) {
  const express = require('express');
  const router = express.Router();

  router.get('/stocks', (req, res) => {
    database
      .query('SELECT Productname, Price, isAdult, StockNum FROM manager')
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
        `INSERT INTO manager(ProductName, Price, isAdult, StockNum) VALUES ('${req.body.ProductName}', ${req.body.Price}, ${req.body.isAdult}, ${req.body.StockNum}) 
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
        `SELECT Productname FROM manager WHERE Productname='${req.params.productName}';`,
      )
      .then((result) => {
        return database.query(
          `DELETE FROM manager WHERE Productname='${req.params.productName}';`,
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

  router.put('/store/list', (req, res) => {
    let result = {};
    if (!req.body.ProductName || !req.body.Amount || !req.body.TotalPrice) {
      result = {
        success: 0,
        err: 'ERR_FILES_NOT_ENOUGH',
      };
      res.json(result);
    }

    database
      .query(
        `INSERT INTO manager(ProductName, Amount, TotalPrice) VALUES ('${
          req.body.ProductName
        }', ${req.body.Amount}, ${req.body.TotalPrice}) 
    ON DUPLICATE KEY UPDATE ProductName='${req.body.ProductName}', Price=${
          req.body.Amount
        }, isAdult=${req.body.TotalPrice + 1}`,
      )
      .then((res) => {
        console.log(res);
        result = {
          success: 1,
        };
        res.json(result);
      })
      .catch((err) => {
        console.log(err);
      });
  });

  return router;
};
