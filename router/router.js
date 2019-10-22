module.exports = (database) => {
  // eslint-disable-next-line global-require
  const express = require('express');
  const router = express.Router();
  // eslint-disable-next-line global-require

  router.get('/customer/fpkey/:fpkey', (req, res) => {
    database
      .query(`SELECT * from customer WHERE fingerprint=${req.params.fpkey}`)
      .then((result) => {
        if (result.length === 0) res.send('invalid');
        else {
          res.json(result);
        }
      })
      .catch(() => res.send());
  });

  router.get('/customer/id/:id', (req, res) => {
    database
      .query(`SELECT * from customer where id=${req.params.id}`)
      .then((result) => {
        if (result.length === 0) res.send('invalid');
        else res.json(result);
      })
      .catch((err) => {
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

  router.delete('/stocks/:productName', (req, res) => {
    database
      .query(
        `SELECT product_name FROM stock WHERE product_name='${req.params.productName}';`,
      )
      .then((result) => {
        if (result === []) {
          return null;
        }
        return database.query(
          `DELETE FROM stock WHERE product_name='${req.params.productName}';`,
        );
      })
      .then((result) => {
        console.log(result);
        if (!result) return;
        res.send(result);
      })
      .catch((err) => res.send(err));
  });

  return router;
};
