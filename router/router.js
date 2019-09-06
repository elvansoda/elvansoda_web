module.exports = function(app, database, io) {
  const express = require("express");
  const router = express.Router();

  router.get("/view", (req, res) => {
    database
      .query("SELECT Productname, Price, isAdult, StockNum FROM manager")
      .then(rows => {
        console.log(rows);
        res.json(rows);
      })
      .catch(err => {
        console.log(err);
        res.send("Cannot find data.");
      });
  });

  router.post("/insert", (req, res) => {
    var ProductName = req.body.ProductName;
    var stocknum = req.body.StockNum;
    var Price = req.body.Price;
    var isAdult = req.body.isAdult;

    database
      .query("SELECT ProductName FROM manager")
      .then(rows => {
        return JSON.stringify(rows).includes(ProductName);
      })
      .then(state => {
        state ? updateTable() : insertTable();
      });

    function updateTable() {
      var updateStatement = "UPDATE manager SET ".concat(
        "StockNum = StockNum + ",
        stocknum,
        ",",
        "isAdult = ",
        isAdult,
        ",",
        "Price = ",
        Price,
        " WHERE ProductName = '",
        ProductName,
        "';"
      );

      database
        .query(updateStatement)
        .then(rows => {
          console.log(rows);
          return database.query(
            "SELECT ProductName, StockNum, Price, isAdult FROM manager"
          );
        })
        .then(rows => {
          console.log(rows);
          res.json(rows);
        })
        .catch(err => {
          console.log(err);
          res.send("Error!");
        });
    }

    function insertTable() {
      var insertStatement = "INSERT INTO manager(ProductName, Price, isAdult, StockNum) VALUES (".concat(
        "'",
        ProductName,
        "',",
        Price,
        ",",
        isAdult,
        ",",
        stocknum,
        ");"
      );

      database
        .query(insertStatement)
        .then(rows => {
          console.log(rows);
          return database.query(
            "SELECT ProductName, StockNum, isAdult, Price FROM manager"
          );
        })
        .then(rows => {
          console.log(rows);
          res.json(rows);
        })
        .catch(err => {
          console.log(err);
        });
    }
  });

  router.post("/payment/update", (req, res) => {
    const ProductName = req.body.ProductName;
    const Price = req.body.Price;

    database
      .query("SELECT ProductName FROM screen")
      .then(rows => {
        console.log(rows);
        return JSON.stringify(rows).includes(ProductName);
      })
      .then(state => {
        state ? updateTable() : insertTable();
      })
      .catch(err => {
        console.log(err);
        res.send(err);
      });

    function updateTable() {
      var updateStatement = "UPDATE screen SET ".concat(
        "Amount = Amount + 1, TotalPrice = TotalPrice + ",
        Price,
        " WHERE ProductName = '",
        ProductName,
        "';"
      );

      database
        .query(updateStatement)
        .then(rows => {
          return database.query(
            "SELECT ProductName, Amount, TotalPrice FROM screen"
          );
        })
        .then(rows => {
          console.log(rows);
          io.emit("data updated", rows);
          res.send("OK");
        })
        .catch(err => {
          console.log(err);
          res.send(err);
        });
    }

    function insertTable() {
      var insertStatement = "INSERT INTO screen(ProductName, Amount, TotalPrice) VALUES(".concat(
        "'",
        ProductName,
        "', ",
        1,
        ",",
        Price,
        ");"
      );

      database
        .query(insertStatement)
        .then(rows => {
          return database.query(
            "SELECT ProductName, Amount, TotalPrice FROM screen"
          );
        })
        .then(rows => {
          console.log(rows);
          io.emit("data updated", rows);
          res.send("OK");
        })
        .catch(err => {
          console.log(err);
          res.send(err);
        });
    }
  });

  router.post("/delete", (req, res) => {
    var ProductName = req.body.ProductName;

    database
      .query("SELECT ProductName FROM manager")
      .then(rows => {
        if (!JSON.stringify(rows).includes(ProductName))
          return new Promise((resolve, reject) => {
            reject("There is no product name like you requested.");
          });
        return ProductName;
      })
      .then(product_name => {
        return database.query(
          "DELETE FROM manager WHERE ".concat(
            "ProductName = '",
            product_name,
            "';"
          )
        );
      })
      .then(() => {
        return database.query("SELECT * FROM manager");
      })
      .then(rows => {
        console.log(rows);
        res.json(rows);
      })
      .catch(err => {
        console.log(err);
        res.send(err);
      });
  });

  return router;
};
