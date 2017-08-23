// https://expressjs.com/en/starter/hello-world.html
// https://scotch.io/tutorials/use-ejs-to-template-your-node-application

var express = require('express');
var path = require('path'); // makes app.use(express.static ... work down below

var cookieParser = require('cookie-parser');
var cookie = require('cookie');  // https://www.npmjs.com/package/cookie
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
		var current_cycle_id = req.query.cycle;
	get_first_and_last_cycle_id(function(first_cycle_id, last_cycle_id){
		find_next_previous_cycle(current_cycle_id, function(previous_cycle_id, next_cycle_id){
			// defines the cycle_id to include in db query: if req.query.cycle returns true (ie, if webpage query string passes a cycle variable), then the db query looks up the current_cycle [currently manually set to 2], otherwise, the query defaults to the most recent cycle (last_cycle):
			var which_cycle_id = last_cycle_id;
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
				db.all('SELECT * FROM cycles ORDER BY begin_date DESC', function(err, cycle_value_from_db) {
					var cycle_id_array = [];
					for (i = 0; i < cycle_value_from_db.length; i++) {
						cycle_id_array[i] = cycle_value_from_db[i].id;
					};
					res.render('pages/form.ejs', {title: 'Form', 
						//cycle_names_to_renderer: cycle_names_from_db, 
						cycle_id_array_to_renderer: cycle_id_array,
						cycle_id_to_renderer: {
							//curr: current_cycle
							curr: current_cycle[0].id
						}
					});
				});
			});
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

// query db for a list of id's from 'cycles' table, ordered by date; pass the array via callback:
function get_cycle_id_by_date(callback) {
	db.all('SELECT id FROM cycles ORDER BY begin_date DESC', function(err, rows_from_db) {
		var cycle_id_array = [];
		var cycles_length = rows_from_db.length;
		for (i = 0; i < cycles_length; i++) {
			cycle_id_array[i] = rows_from_db[i].id;
		};
		callback(cycle_id_array);
	});
};

// get array of cycle id's via get_cycle_id_by_date(), then save the first and last in their own variables and pass vars via callback:
function get_first_and_last_cycle_id(callback) {
	get_cycle_id_by_date(function(cycle_id_array){
		var first_cycle_id = cycle_id_array[cycle_id_array.length-1];
		var last_cycle_id = cycle_id_array[0];
//		console.log('first_cycle_id: ' + first_cycle_id + ', last_cycle_id: ' + last_cycle_id + '\n');
		callback(first_cycle_id, last_cycle_id);
	});
};

// get array of cycle id's via get_cycle_id_by_date(), then save the next and previous (relative to the current cycle id) in their own variables and pass vars via callback:
function find_next_previous_cycle(current_cycle_id, callback) {
	get_cycle_id_by_date(function (cycle_id_array){
		var current_cycle_id_index = 0;
		for (i = 0; i < cycle_id_array.length; i++) {
			if (cycle_id_array[i] == current_cycle_id) {
				current_cycle_id_index = i;
			};
		};
		var previous_cycle_id = cycle_id_array[current_cycle_id_index + 1];
		var next_cycle_id = cycle_id_array[current_cycle_id_index - 1];
		callback(previous_cycle_id, next_cycle_id);
	});
};

// access and route info for index.ejs to render home page of app.  includes functions that helps determine which cycle chart to show on the page (more deets below and in comments for supporting functions):
router.get('/', function(req,res) {
	console.log("Cookies: ", req.cookies);
	// get current cycle from data in query string passed through URL from index.ejs:
	var current_cycle_id = req.query.cycle;
	// get the following cycle id's via callbacks: first, last, previous, next
	get_first_and_last_cycle_id(function(first_cycle_id, last_cycle_id){
		find_next_previous_cycle(current_cycle_id, function(previous_cycle_id, next_cycle_id){
			// defines the cycle_id to include in db query: if req.query.cycle returns true (ie, if webpage query string passes a cycle variable), then the db query looks up the current_cycle, otherwise, the query defaults to the most recent cycle (last_cycle):
			var which_cycle_id = last_cycle_id;
			if (req.query.cycle) {
				which_cycle_id = current_cycle_id;
			};
			db.all('SELECT *, strftime(\'%m/%d\', date) as \'month_day\' FROM time_temp WHERE cycle_id = "' + which_cycle_id + '" ORDER BY date', function(err, rows_from_db) { 

					// variables for query below with conditions so that the query doesn't break if next_cycle_id is undefined (ie, if the page is displaying the final cycle and there is no next cycle created yet): 
					var id_search_var = 0;
					if (next_cycle_id) {
						id_search_var = next_cycle_id;
					} else {
						id_search_var = which_cycle_id; // simply assigning id_search_var to something that I know won't be undefined and break the query below
					};

					// query to find beginning and end dates of currently displayed cycle: 
					db.all('SELECT begin_date, date(begin_date, \'-1 day\') as \'yesterday\' FROM cycles WHERE id = ' + which_cycle_id + ' or id = ' + id_search_var + ' ORDER BY begin_date', function(err, dates_from_db){
							if (next_cycle_id) {
								var begin_date = dates_from_db[0].begin_date;
								var end_date = dates_from_db[1].yesterday;
							} else {
								var begin_date = dates_from_db[0].begin_date;
								var end_date = 'Today';
							};

					// massages data gleaned from time_temp query into a format that can be used by chart in chartist_partial_temp.ejs (via res.render() section below); create if condition to verify that branch of code only runs if there are data points for this cycle (if time_temp query doesn't return empty or null):
					var date_temp_object = []
					if (rows_from_db.length != 0) {
						//console.log("running date_temp_object branch");
						for (var i = 0; i < rows_from_db.length; i++){
							// assign a new object in my array:
							date_temp_object[i] = {}; 
							// put values into new object:
							date_temp_object[i].x = "new Date (\'" + rows_from_db[i].date + "T12:30\')";
							date_temp_object[i].y = rows_from_db[i].temp_f;
						}
					}

					// calculate time range in integer form for 'divisor' section in chartist_partial_temp.ejs; create if condition to verify that branch of code only runs if there are data points for this cycle (if time_temp query doesn't return empty or null):
					var date_range_int = 0;
					if (rows_from_db.length != 0) {
						//console.log("running date_range_int branch");
						var start_date_int = new Date(rows_from_db[0].date);
						var end_date_int = new Date(rows_from_db[(rows_from_db.length)-1].date);
						date_range_int = ((end_date_int - start_date_int)/1000/60/60/24); // convert milliseconds to whole days
					} 

					// res.render sends various variables to index.ejs and its dependent pages:
					res.render('pages', {
						title: 'Home', 
						// rough hack: attempt to prevent homepage from breaking when there's a new cycle that has no child entries: if the 0-th element of rows_from_db exists, link rows_to_renderer to rows_from_db, otherwise, link rows_to_renderer to empty array object:
						rows_to_renderer: rows_from_db[0] ? rows_from_db : [{}], 
						date_temp_object_to_renderer: date_temp_object,
						// render beginning and end dates of currently displayed cycle to index.ejs:
						begin_date_to_renderer: begin_date,
						end_date_to_renderer: end_date,
						date_range_int_to_renderer: date_range_int,
						cycle_id_to_renderer: {
							prev: previous_cycle_id, 
							curr: current_cycle_id, 
							next: next_cycle_id, 
							first: first_cycle_id, 
							last: last_cycle_id
						}
					});
				});
			});
		});
	});
});

router.post('/formpost', function(req, res) {
	console.log("cycle name: ");
	console.log(req.body["name"]);
	// if a new cycle is being initiated:
	if(req.body["cycle_id"] == 'new cycle') {
		// insert new name and begin_date to cycles table (which will auto-generate an id): 
		db.all("INSERT INTO cycles (name, begin_date) VALUES(\"" + req.body["name"] + "\", \"" + req.body["date"]+ "\")", function(err, rows_from_cycles_insert) {
			// look up the new cycle I just created to find out what the new id is:
			db.all("SELECT * FROM cycles WHERE name = \"" + req.body["name"] + "\"", function(err, rows_from_cycles_select) {
				console.log("rows_from_cycles_select: ");
				console.log(rows_from_cycles_select);
				// also insert new entry data into time_temp table, using the new cycle id I just looked up to link the child entry to the parent entry:
				var new_cycle_id = rows_from_cycles_select[0].id;
				db.all("INSERT INTO time_temp(date, time_taken, temp_f, cycle_id) VALUES( \"" + req.body["date"] + "\", \"" + req.body["time_taken"] + "\", \"" + req.body["temp_f"] + "\", \"" + new_cycle_id + "\")", function(err, rows_from_time_temp) {
					// after conducting all this brain work, redirect to home page: 
console.log(err);console.log("<<<<>>>>"); // JE: shows the 'contents' of object 'err'; the 'contents' aren't printed out the same way you'd expect for a regular object, such as the array results of sqlite query (this is because console.log() has special machinery to insepct and spit out objects of type 'Error'
// JE: supporting 'Error' documentation here: https://nodejs.org/api/errors.html 
//console.log(err.constructor.name); // JE: shows the type of the object 'err'
					res.redirect('/');
					//res.redirect('/?cycle=' + new_cycle_id);
				});
			});
		});
	// or else if cycle_id equals the id of an already existing cycle: 
	} else {
		// insert new entry data into time_temp (including cycle_id of existing cycle): 
		db.all("INSERT INTO time_temp (date, time_taken, temp_f, cycle_id) VALUES( \"" + req.body["date"] + "\", \"" + req.body["time_taken"] + "\", \"" + req.body["temp_f"] + "\", \"" + req.body["cycle_id"] + "\")", function(err, rows_from_time_temp) {
			// after conducting this brain work, redirect to home page: 
			// redirect to the cycle of the row I just created (not defaulting to most recent cycle): 
			res.redirect('/?cycle=' + req.body["cycle_id"]);
		});
	}


/*
	db.all("INSERT INTO time_temp (date, time_taken, temp_f, cycle_id) VALUES( \"" + req.body["date"] + "\", \"" + req.body["time_taken"] + "\", \"" + req.body["temp_f"] + "\", \"" + req.body["cycle_id"] + "\")", function(err, rows) {
		res.redirect('/');
	});
*/
});


router.post('/deletepost', function(req, res) {
	var query = "";
	db.all(query="DELETE FROM time_temp WHERE id=" + req.body["id_home"], function(err, rows) {
		console.log("attempted to delete with ((" + query + "))");
		//res.redirect('/');
		// redirect to the cycle of the row I just deleted (not defaulting to most recent cycle): 
		res.redirect('/?cycle=' + req.body["cycle_id"]);
	});
});

router.post('/form_post_update', function(req, res) {
	var query = "";
	db.all(query="UPDATE time_temp SET date=\"" + req.body["date"] + "\", time_taken=\"" + req.body["time_taken"] + "\", temp_f=" + req.body["temp_f"] + ", cycle_id=" + req.body["cycle_id"] + " WHERE id=" + req.body["id"], function(err, rows) {
		console.log("attempted to update with ((" + query + "))");
		// redirect to the cycle of the row I just updated (not defaulting to most recent cycle): 
		res.redirect('/?cycle=' + req.body["cycle_id"]);
	});
});

router.get('/cookie', function(req,res){
	var cookie_name = "cookieq_name";
	res.cookie(cookie_name, 'cookieq_value', {/*expire: new Date() + 9999*/ maxAge: 60 * 60 * 24 * 7}).send('Cookie is set');
	// CE: network header reads out this: cookieq_name=cookieq_value; Max-Age=604; Path=/; Expires=Wed, 23 Aug 2017 16:45:02 GMT
	// CE: it seems weird that it would have both a max age and an expires -- shouldn't it be one or the other? also, the max age doesn't match my math, which should be 604800 s or something (== 1 week)
	// https://www.npmjs.com/package/cookie:
	//res.setHeader('Set-Cookie', cookie.serialize('cookiez_name', 'cookiez_value', {/*expire: (new Date()).toString()*/ maxAge: 60 * 60 * 24 * 7}) );
	res.send('Cookie\'s sent, bitches!');
});

router.get('/clearcookie', function(req,res){
	clearCookie('cookie_name');
	res.send('Cookie deleted');
});

app.listen(3000, function() {
	console.log('Example app listening on port 3000!');
});


