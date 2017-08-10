// https://expressjs.com/en/starter/hello-world.html
// https://scotch.io/tutorials/use-ejs-to-template-your-node-application

var express = require('express');
var path = require('path'); // makes app.use(express.static ... work down below

var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public'))); // accesses public directory

var router = app;//express.Router();
app.set('view engine', 'ejs');  // line 16 of app.js in Lionheart

// global variables to open and access database
var sqlite3 = require('sqlite3').verbose();
var file = 'fam_beta.db';
var db = new sqlite3.Database(file);
