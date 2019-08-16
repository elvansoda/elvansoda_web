module.exports = function(app)
{
    var express = require('express');
    var router = express.Router();

    router.get('/', (req, res) => {
        res.render('Page1.ejs');
    });

    return router;
}