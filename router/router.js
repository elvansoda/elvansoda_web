module.exports = (database) => {
  // eslint-disable-next-line global-require
  const express = require('express');
  const router = express.Router();

  router.get('/customer/:fpkey', (req, res) => {
    database
      .query(`SELECT * from customer WHERE fingerprint=${req.params.fpkey}`)
      .then(res.send)
      .catch(res.send);
  });

  router.get('/stocks', (_req, res) => {
    database
      .query('SELECT product_name, price, is_adult, stock_number FROM stock')
      .then((rows) => {
        res.json(rows);
      })
      .catch(res.send);
  });

  router.put('/stocks', (req, res) => {
    database
      .query(
        `INSERT INTO stock(product_name, price, is_adult, stock_number) VALUES ('${req.body.product_name}', ${req.body.price}, ${req.body.is_adult}, ${req.body.stock_number}) 
        ON DUPLICATE KEY UPDATE product_name='${req.body.product_name}', price=${req.body.price}, is_adult=${req.body.is_adult}, stock_number=${req.body.stock_number}`,
      )
      .then(res.json)
      .catch(res.send);
  });

  router.post('/stocks/', (req, res) => {
    const dataList = req.body.json;
    for (let i; i < dataList.length; i += 1) {
      database
        .query(
          `UPDATE stock SET stock_number=stock_number-${dataList[i].stock_number} where product_name='${dataList[i].product_name}'`,
        )
        .then(res.json)
        .catch(res.send);
    }
  });

  router.delete('/stocks/:productName', (req, res) => {
    console.log(req.params.productName);
    database
      .query(
        `SELECT Productname FROM stock WHERE Productname='${req.params.productName}';`,
      )
      .then(
        () =>
          // eslint-disable-next-line implicit-arrow-linebreak
          database.query(
            `DELETE FROM stock WHERE Productname='${req.params.productName}';`,
          ),
        // eslint-disable-next-line function-paren-newline
      )
      .then((result) => {
        console.log(result);
        res.send(result);
      })
      .catch(res.send);
  });

  return router;
};
