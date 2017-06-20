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

// global variables to open and access database
var sqlite3 = require('sqlite3').verbose();
var file = 'fam_beta.db';
var db = new sqlite3.Database(file);

router.get('/form', function(req, res) {
	res.render('pages/form.ejs', {title: 'Form'});
});

router.get('/form_update', function(req, res) {
	db.all(query='SELECT * FROM time_temp WHERE id = ' + req.query.id, function(err, rows_from_db) { 
		console.log("attempted to query database with __" + query + "__");
		res.render('pages/form_update.ejs', {title: 'Form Update', row_to_renderer: rows_from_db[0]});
	});
	//res.render('pages/form_update.ejs', {title: 'Form Update', rows: rows});
});

var find_cycle_id = function(current_id, offset, callback) {
	db.all('SELECT name AS id FROM cycles WHERE name ="' + offset + '" ORDER BY begin_date DESC', function(err, rows_from_db) { 
//		console.log("rows from db " + rows_from_db[0].id);
		console.log(rows_from_db);
		callback(rows_from_db[0].id);
	});
};

router.get('/', function(req, res) {
	// http://www.w3resource.com/node.js/nodejs-sqlite.php
	find_cycle_id(null, "cycle_17", function(cycle_id) {
		//console.log("rows from db " + cycle_id);
		db.all('SELECT * FROM time_temp WHERE cycle = "' + cycle_id + '" ORDER BY date', function(err, rows_from_db) { 
			res.render('pages', {title: 'Home', rows_to_renderer: rows_from_db});
		});
	});
/*
	if (req.query.cycle == "1") {
		db.all('SELECT * FROM time_temp WHERE cycle = "cycle_33" ORDER BY date', function(err, rows_from_db) { 
			res.render('pages', {title: 'Home', rows_to_renderer: rows_from_db});
		});
	} else {
		db.all('SELECT * FROM time_temp ORDER BY date', function(err, rows_from_db) { 
			res.render('pages', {title: 'Home', rows_to_renderer: rows_from_db});
		});
	};
*/
});

router.post('/formpost', function(req, res) {
	db.all("INSERT INTO time_temp (date, time_taken, temp_f) VALUES( \" " + req.body["date"] + " \", \" " + req.body["time_taken"] + " \", \" " + req.body["temp_f"] + " \")", function(err, rows) {
		res.redirect('/');
	});
});


router.post('/deletepost', function(req, res) {
	var query = "";
	db.all(query="DELETE FROM time_temp WHERE id=" + req.body["id"], function(err, rows) {
		console.log("attempted to delete with ((" + query + "))");
		res.redirect('/');
	});
});

router.post('/form_post_update', function(req, res) {
	var query = "";
	db.all(query="UPDATE time_temp SET date=\"" + req.body["date"] + "\", time_taken=\"" + req.body["time_taken"] + "\", temp_f=" + req.body["temp_f"] + " WHERE id=" + req.body["id"], function(err, rows) {
		console.log("attempted to update with ((" + query + "))");
		res.redirect('/');
	});
});

app.listen(3000, function() {
	console.log('Example app listening on port 3000!');
});

