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
/*
var find_cycle_id = function(current_id, offset, callback) {
	db.all('SELECT id FROM cycles WHERE id =' + offset + ' ORDER BY begin_date DESC', function(err, rows_from_db) { 
//		console.log("rows from db " + rows_from_db[0].id);
		console.log(rows_from_db);
		callback(rows_from_db[0].id);
	});
};
*/

// this function looks up the beginning and ending "brackets" of paging through each cycle: laying out all of the id's in cycle table, storing the data in a simple array, and then using the indeces of the array to look up the id of the current cycle, as well as the next and previous ones.  This is all used in res.render('/'...) to help with printing the correct cycle on the home page of my site:
function cycle_brackets(current_cycle_id, callback){
	// this db query looks up the ids of all entries in cycles table, ordered by date (not id) in descending order: 
	db.all('SELECT id FROM cycles ORDER BY begin_date DESC', function(err, rows_from_db) { 
		// empty array to hold the id's (in descending-date-order) of "cycles" table:
		var cycle_id_array = []; 
		// finds the length of the array-object returned by the sql query, and pops that into the for loop length:
		var cycles_length = Object.keys(rows_from_db).length; 
		for (i = 0; i < cycles_length; i++) {
			// populate cycle_id_array with index values of sql query results:
			cycle_id_array[i] = rows_from_db[i].id; 
		};
		console.log(cycle_id_array);

		// var current_cycle_id_index equals array index of current_cycle_id (or if there's no current_cycle_id, then it defaults to 0, or the most recent cycle at the beginning of the array), then use current_cycle_id_index to math out previous_cycle_id and next_cycle_id (the math is backwards because the array is in descending order):
		var current_cycle_id_index = 0; 
		for (i = 0; i < cycles_length; i++) {
			if (cycle_id_array[i] == current_cycle_id) { 
				current_cycle_id_index = i;
			};
		};
		console.log("current_cycle_id_index: " + current_cycle_id_index);
		var previous_cycle_id = cycle_id_array[current_cycle_id_index + 1];
		var next_cycle_id = cycle_id_array[current_cycle_id_index - 1];
		console.log("previous: " + previous_cycle_id + ", next: " + next_cycle_id);
		callback(previous_cycle_id, next_cycle_id, cycle_id_array);
	});
};

//var current_cycle = 5;
router.get('/', function(req, res) {
	var current_cycle = req.query.cycle;
	/*
	// http://www.w3resource.com/node.js/nodejs-sqlite.php
	var cycle_offset = current_cycle; //find way to set up query to find out the highest number each time
	if (req.query.cycle) {
		cycle_offset = cycle_offset + Number(req.query.cycle);
		current_cycle = cycle_offset;
	};
	console.log("cycle from index.ejs hyperlink: " + cycle_offset);
	*/
	cycle_brackets(current_cycle, function(previous_cycle, next_cycle, cycle_id_array) {
		if (req.query.cycle) {		
			db.all('SELECT * FROM time_temp WHERE cycle_id = "' + current_cycle + '" ORDER BY date', function(err, rows_from_db) { 
				res.render('pages', {
					title: 'Home', 
					rows_to_renderer: rows_from_db, 
					cycle_id_to_renderer: {
						prev: previous_cycle, 
						curr: current_cycle, 
						next: next_cycle
					}
				});
			});
		} else { // CE: fix "2" below to something dynamic:
			db.all('SELECT * FROM time_temp WHERE cycle_id = "'+ cycle_id_array[0] +'" ORDER BY date', function(err, rows_from_db) { 
				res.render('pages', {
					title: 'Home', 
					rows_to_renderer: rows_from_db, 
					cycle_id_to_renderer: {
						prev: previous_cycle, 
						curr: current_cycle, 
						next: next_cycle
					}
				});
			});
		};
	});
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

