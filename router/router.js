module.exports = (database) => {
  // eslint-disable-next-line global-require
  const express = require('express');
  const router = express.Router();
  // eslint-disable-next-line global-require

  router.get('/customer/:fpkey', (req, res) => {
    database
      .query(`SELECT * from customer WHERE fingerprint=${req.params.fpkey}`)
      .then((result) => {
        if (result) res.send('OK');
        else res.send('NO');
      })
      .catch(() => res.send());
  });

  router.get('/customer/:id', (req, res) => {
    database
      .query('SELECT * from customer')
      .then((result) => {
        console.log(result);
        console.log('=======================');
        res.json(result);
      })
      .catch((err) => {
        console.log(err);
        res.send(err);
      });
  });

  router.get('/stocks', (_req, res) => {
    database
      .query('SELECT product_name, price, is_adult, stock_number FROM stock')
      .then((rows) => {
        res.json(rows);
      })
      .catch(() => res.send());
  });

  router.put('/stocks', (req, res) => {
    database
      .query(
        `INSERT INTO stock(product_name, price, is_adult, stock_number) VALUES ('${req.body.product_name}', ${req.body.price}, ${req.body.is_adult}, ${req.body.stock_number}) 
        ON DUPLICATE KEY UPDATE product_name='${req.body.product_name}', price=${req.body.price}, is_adult=${req.body.is_adult}, stock_number=${req.body.stock_number}`,
      )
      .then(() => res.json())
      .catch(() => res.send());
  });

  router.post('/stocks', (req, res) => {
    const dataList = req.body;

    for (let i = 0; i < dataList.length; i += 1) {
      database
        .query(
          `UPDATE stock SET stock_number=stock_number-${dataList[i].stock_number} where product_name='${dataList[i].product_name}'`,
        )
        .then(() => res.json())
        .catch(() => res.send());
    }
  });

  router.post('/stocks/:productName', (req, res) => {
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
