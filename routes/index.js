// https://expressjs.com/en/starter/hello-world.html
// https://scotch.io/tutorials/use-ejs-to-template-your-node-application

var express = require('express');
var app = express();
var router = app;//express.Router();
app.set('view engine', 'ejs');  // line 16 of app.js in Lionheart
/*
router.get('/', function(req, res) {
	res.render('pages/index.ejs', {title: 'Home'});
});
*/
router.get('/form', function(req, res) {
	res.render('pages/form.ejs', {title: 'Form'});
});

router.get('/', function(req, res) {
	// http://www.w3resource.com/node.js/nodejs-sqlite.php
	var sqlite3 = require('sqlite3').verbose();
	var file = 'fam_beta.db';
	var db = new sqlite3.Database(file);
	db.all('SELECT * FROM time_temp', function(err, rows) { 
		res.render('pages', {title: 'Home', rows: rows});
	});
	db.close();
});
/*
router.get('/form', function(req, res) {
	res.render('pages/form', {title: 'Form'});
});
*/
router.post('/formpost', function(req, res) {
	var sqlite3 = require('sqlite3').verbose();
	var file = 'fam_beta.db';
	var db = new sqlite3.Database(file);
	db.all('INSERT INTO time_temp (date, time_taken, temp_f) VALUES(\'' + req.body['time_temp'] + '\')', function(err, rows) {
		res.redirect('/');
	});
	db.close();
});

app.listen(3000, function() {
	console.log('Example app listening on port 3000!');
});

