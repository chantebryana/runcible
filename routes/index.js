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

router.get('/form', function(req, res) {
	// defines the cycle_id to include in db query: if req.query.cycle returns true (ie, if webpage query string passes a cycle variable), then the db query looks up the current_cycle [currently manually set to 2], otherwise, the query defaults to the most recent cycle (last_cycle):
	var which_cycle_id = 2; // CE: change this to dynamic variable, not static number
	if (req.query.current_cycle) {
		which_cycle_id = req.query.current_cycle;
	}
	var query = "";
	db.all (query='SELECT id FROM cycles WHERE id = ' + which_cycle_id, function(err, current_cycle) {
	console.log('attempted to query db with __ ' + query + ' __');
	console.log(current_cycle);
	// 2 temporary lines: 
	//var last_cycle = 2;
	//var cycle_id_to_renderer = {last: last_cycle};
	res.render('pages/form.ejs', {title: 'Form', 
		cycle_id_to_renderer: {
			//curr: current_cycle
			curr: current_cycle[0].id
		}
	});
	});
});

router.get('/form_update', function(req, res) {
	db.all(query='SELECT * FROM time_temp WHERE id = ' + req.query.id, function(err, rows_from_db) { 
		console.log("attempted to query database with __" + query + "__");
		res.render('pages/form_update.ejs', {title: 'Form Update', row_to_renderer: rows_from_db[0]});
	});
	//res.render('pages/form_update.ejs', {title: 'Form Update', rows: rows});
});


// this function looks up the beginning and ending "brackets" of paging through each cycle: laying out all of the id's in cycle table, storing the data in a simple array, and then using the indeces of the array to look up the id of the current cycle, as well as the next and previous ones.  This is all used in res.render('/'...) to help with printing the correct cycle on the home page of my site:
function cycle_brackets(current_cycle_id, callback){
	// this db query looks up the ids of all entries in cycles table, ordered by date (not id) in descending order: 
	db.all('SELECT id FROM cycles ORDER BY begin_date DESC', function(err, rows_from_db) { 
		// empty array to hold the id's (in descending-date-order) of "cycles" table:
		var cycle_id_array = []; 
		// finds the length of the array-object returned by the sql query, and pops that into the for loop length:
		var cycles_length = rows_from_db.length; 
		for (i = 0; i < cycles_length; i++) {
			// populate cycle_id_array with index values of sql query results:
			cycle_id_array[i] = rows_from_db[i].id; 
		};
		console.log(cycle_id_array, rows_from_db.length);

		// var current_cycle_id_index equals array index of current_cycle_id (or if there's no current_cycle_id, then it defaults to 0, or the most recent cycle at the beginning of the array), then use current_cycle_id_index to math out previous_cycle_id and next_cycle_id (the math is backwards because the array is in descending order):
		var current_cycle_id_index = 0; 
		for (i = 0; i < cycles_length; i++) {
			if (cycle_id_array[i] == current_cycle_id) { 
				current_cycle_id_index = i;
			};
		};
		console.log("current_cycle_id_index: " + current_cycle_id_index);
		var first_cycle_id = cycle_id_array[cycle_id_array.length-1];
		var previous_cycle_id = cycle_id_array[current_cycle_id_index + 1];
		var next_cycle_id = cycle_id_array[current_cycle_id_index - 1];
		var last_cycle_id = cycle_id_array[0];
		console.log("previous: " + previous_cycle_id + ", next: " + next_cycle_id);
		callback(previous_cycle_id, next_cycle_id, first_cycle_id, last_cycle_id);
	});
};

router.get('/', function(req, res) {
	// get current cycle from data in query string passed through URL from index.ejs:
	var current_cycle = req.query.cycle;
	// cycle_brackets() defined in function above
	cycle_brackets(current_cycle, function(previous_cycle, next_cycle, first_cycle, last_cycle) {
		// defines the cycle_id to include in db query: if req.query.cycle returns true (ie, if webpage query string passes a cycle variable), then the db query looks up the current_cycle, otherwise, the query defaults to the most recent cycle (last_cycle):
		var which_cycle_id = last_cycle;
		if(req.query.cycle){
			which_cycle_id = current_cycle;
		}
		db.all('SELECT *, strftime(\'%m/%d\', date) as \'month_day\' FROM time_temp WHERE cycle_id = "' + which_cycle_id + '" ORDER BY date', function(err, rows_from_db) { 
			var temp_array = []
			var date_array = []
			for (var i = 0; i < rows_from_db.length; i++){
				temp_array[i] = rows_from_db[i].temp_f
				date_array[i] = "\"" + rows_from_db[i].month_day + "\""
			}
			// res.render sends various variables to index.ejs and its dependent pages:
			res.render('pages', {
				title: 'Home', 
				rows_to_renderer: rows_from_db, 
				temp_array_to_renderer: temp_array,
				date_array_to_renderer: date_array,
				cycle_id_to_renderer: {
					prev: previous_cycle, 
					curr: current_cycle, 
					next: next_cycle, 
					first: first_cycle, 
					last: last_cycle
				}
			});
		});
	});
});

router.post('/formpost', function(req, res) {
	db.all("INSERT INTO time_temp (date, time_taken, temp_f, cycle_id) VALUES( \" " + req.body["date"] + " \", \" " + req.body["time_taken"] + " \", \" " + req.body["temp_f"] + " \", \" " + req.body["cycle_id"] + " \")", function(err, rows) {
		res.redirect('/');
	});
});


router.post('/deletepost', function(req, res) {
	var query = "";
	db.all(query="DELETE FROM time_temp WHERE id=" + req.body["id_home"], function(err, rows) {
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

