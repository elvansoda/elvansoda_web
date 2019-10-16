module.exports = function(app, database, io) {
  const express = require('express');
  const router = express.Router();

  router.get('/stocks', (req, res) => {
    database
      .query('SELECT product_name, price, is_adult, stock_number FROM stock')
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
        `INSERT INTO stock(product_name, price, is_adult, stock_number) VALUES ('${req.body.product_name}', ${req.body.price}, ${req.body.is_adult}, ${req.body.stock_number}) 
        ON DUPLICATE KEY UPDATE product_name='${req.body.product_name}', price=${req.body.price}, is_adult=${req.body.is_adult}, stock_number=${req.body.stock_number}`,
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
