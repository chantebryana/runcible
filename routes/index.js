// https://expressjs.com/en/starter/hello-world.html
// https://scotch.io/tutorials/use-ejs-to-template-your-node-application

var express = require('express');

var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

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

router.get('/form_update', function(req, res) {
	var sqlite3 = require('sqlite3').verbose();
	var file = 'fam_beta.db';
	var db = new sqlite3.Database(file);
	var query = "";
	db.all(query='SELECT * FROM time_temp WHERE id = ' + req.query.id, function(err, rows_from_db) { 
		console.log("attempted to query database with __" + query + "__");
		res.render('pages/form_update.ejs', {title: 'Form Update', row_to_renderer: rows_from_db[0]});
	});
	db.close();
	//res.render('pages/form_update.ejs', {title: 'Form Update', rows: rows});
});

router.get('/', function(req, res) {
	// http://www.w3resource.com/node.js/nodejs-sqlite.php
	var sqlite3 = require('sqlite3').verbose();
	var file = 'fam_beta.db';
	var db = new sqlite3.Database(file);
	db.all('SELECT * FROM time_temp ORDER BY date', function(err, rows_from_db) { 
		res.render('pages', {title: 'Home', rows_to_renderer: rows_from_db});
	});
	db.close();
});

router.post('/formpost', function(req, res) {
	var sqlite3 = require('sqlite3').verbose();
	var file = 'fam_beta.db';
	var db = new sqlite3.Database(file);
	db.all("INSERT INTO time_temp (date, time_taken, temp_f) VALUES( \" " + req.body["date"] + " \", \" " + req.body["time_taken"] + " \", \" " + req.body["temp_f"] + " \")", function(err, rows) {
		res.redirect('/');
	});
	db.close();
});


router.post('/deletepost', function(req, res) {
	var sqlite3 = require('sqlite3').verbose();
	var file = 'fam_beta.db';
	var db = new sqlite3.Database(file);
	var query = "";
	db.all(query="DELETE FROM time_temp WHERE id=" + req.body["id"], function(err, rows) {
		console.log("attempted to delete with ((" + query + "))");
		res.redirect('/');
	});

	db.close();
});

router.post('/form_post_update', function(req, res) {
	var sqlite3 = require('sqlite3').verbose();
	var file = 'fam_beta.db';
	var db = new sqlite3.Database(file);
	var query = "";
	db.all(query="UPDATE time_temp SET date=" + req.body["date"] + ", time_taken=" + req.body["time_taken"] + ", temp_f=" + req.body["temp_f"] + " WHERE id=" + req.body["id"], function(err, rows) {
		console.log("attempted to update with ((" + query + "))");
		res.redirect('/');
	});

	db.close();
});

app.listen(3000, function() {
	console.log('Example app listening on port 3000!');
});

