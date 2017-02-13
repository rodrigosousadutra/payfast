var express = require('express');
var consign = require('consign');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');

module.exports = function() {

    var app = express();

    app.use(bodyParser.urlencoded({extended: true}));
    //This object will contain key-value pairs, where the value can be a string or array (when extended is false), or any type (when extended is true).
    //Utilizado mais em metodos get
    app.use(bodyParser.json());
    app.use(expressValidator());

    consign()
        .include('controllers')
        .then('persistencia')
        .then('servicos')
        .into(app);

    return app;
}