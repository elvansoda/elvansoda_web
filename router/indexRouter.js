module.exports = function(app) {
  const express = require("express");
  const router = express.Router();

  router.get("/", (req, res) => {
    res.render("index.html");
  });

  return router;
};
