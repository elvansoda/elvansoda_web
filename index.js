const express = require('express');

const app = express();
const bodyParser = require('body-parser');
const mysql = require('mysql');
const { parse } = require('comment-json');

class Database {
  constructor(config) {
    this.connection = mysql.createConnection(config);
  }

  query(sql, args) {
    return new Promise((resolve, reject) => {
      this.connection.query(sql, args, (err, rows) => {
        if (err) return reject(err);
        return resolve(rows);
      });
    });
  }

  close() {
    return new Promise((resolve, reject) => {
      this.connection.end((err) => {
        if (err) return reject(err);
        return resolve();
      });
    });
  }
}

const port = process.env.PORT || 3000;
// eslint-disable-next-line no-unused-vars
const server = app.listen(port, () => {
  console.log('Express server has started on port 3000');
});

const mysqlData = require('./config.js');

const database = new Database(mysqlData);

const jsonParser = bodyParser.json();
app.use(jsonParser);
app.use(bodyParser.urlencoded({ extended: true }));

const router = require('./router/router.js')(parse, database);

app.use('/api', router);

setInterval(() => {
  database.query('SELECT 1').catch(console.log);
}, 5000);
