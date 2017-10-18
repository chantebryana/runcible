// https://expressjs.com/en/starter/hello-world.html
// https://scotch.io/tutorials/use-ejs-to-template-your-node-application

express = require('express');
path = require('path'); // makes app.use(express.static ... work down below

cookieParser = require('cookie-parser');
cookie = require('cookie');  // https://www.npmjs.com/package/cookie
cookie_var = ""; // CE: temporary cookie variable
bodyParser = require('body-parser');

app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public'))); // accesses public directory

router = app;//express.Router();
app.set('view engine', 'ejs');  // line 16 of app.js in Lionheart

// global variables to open and access database
sqlite3 = require('sqlite3').verbose();
file = 'fam_beta.db';
db = new sqlite3.Database(file);

//
//
//
//
//CE: all the requires!
require('/home/ruby/Projects/runcible/routes/run_smart');
//require('/home/ruby/Projects/runcible/routes/helper_func/get_pg_load');





// .post_pg_load combines the features of .post with the homemade functions check_browser_cookie() and increment_pg_load(), which together do the following: check browser for secret cookie id (and creates and saves [to browser cookie cache and to db table on server side] a new one if needed), and then accesses the page load variable and increments it up by 1. the final page load variable is passed forward to res.render, where the page count is printed on the rendered web page:
router.post_pg_load = function post_pg_load(url_string, callback) {
	this.post(url_string, function(req, res){
		check_browser_cookie(req, res, function(secret_cookie) {
			increment_pg_load(secret_cookie, function(pg_load) {
				callback(req, res, pg_load);
			});
		});
	});
}


//
//
//
//
// 6 new global functions: CE PLAYING WITH COOKIES:
function check_browser_cookie(req, res, callback){
	// save browser's cookie to browser_cookie_key via req.cookies:
	var browser_cookie_key = req.cookies;
	// access db table to verify whether browser_cookie_key matches any entries: 
	// JE: MUST FIX: sql injection attack:
	db.run_smart("SELECT session_data FROM cookie_key_json WHERE cookie_key = \"" + browser_cookie_key.cookie_key + "\"", function(err, rows) {
		// if query returns no results (ie, no browser cookie or browser cookie doesn't match any table entries): 
		if (rows.length == 0) {
			// call helper functions that will create new id, create new db table entry, and save new id to browser cookie cache. afterwards, declare callback with new_cookie_key to pass value forward to future functions: 
			create_and_save_cookie_id(res, function(new_cookie_key) {
				// passes newly-generated cookie key string forward to future functions:
				callback(new_cookie_key);
			});
		} else {
			// pass browser_cookie_key string forward to future functions:
			callback(browser_cookie_key.cookie_key);
		}
	});
}

function make_id() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 6; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
	};
  return text;
}
 
function insert_new_id_to_db_table(new_cookie_key, callback){
	// insert new secret cookie id into db table: create new entry with a page_count value of 0 (this value will increment up to 1 in increment_pg_load function):
	//JE: no sql injection attack risk b/c query is based off of just-made new cookie key:
	db.run_smart("INSERT INTO cookie_key_json (cookie_key, session_data) VALUES (\"" + new_cookie_key + "\", '{\"page_count\":0}')", function(err, rows) { 
		// since this was asynchronous, declare callback to direct traffic back to the calling function (rather than getting lost in space):	
		callback(); 
	});
}

function save_new_cookie_id_to_browser(res, new_cookie_key){
	// exactly what the function name suggests: use res.setHeader to save newly-created cookie to browser's cache:
	res.setHeader('Set-Cookie', cookie.serialize('cookie_key', new_cookie_key));
}

// create a new cookie key, save it to db table and save to browser's cookie cache; finish by declaring callback (which effectively passes secret_cookie_id forward to next function): 
function create_and_save_cookie_id(res, callback) {
	var secret_cookie_id = make_id();
	insert_new_id_to_db_table(secret_cookie_id, function(){
		save_new_cookie_id_to_browser(res, secret_cookie_id);
		callback(secret_cookie_id);
	});
}

// access pg load data from db table, increment it by 1, then push to relevant locations (update server and web page renderer): 
function increment_pg_load(browser_cookie_key, callback) {
	// based on secret browser key, look up appropriate row from cookie_key_json db table using Jim's db.run_smart instead of db.all:
	db.run_smart("SELECT session_data FROM cookie_key_json WHERE cookie_key = \"" + browser_cookie_key + "\"", function(err, rows_from_select) {
		// parse out JSON-style data that db returned:
		var parsed_rows = JSON.parse(rows_from_select[0].session_data);
		// save page_count portion of parsed data to its own variable:
		var pg_load = parsed_rows.page_count;
		// increment pg_load by 1 (because page loaded or refreshed to get to this portion of code):
		pg_load += 1;
		// update page_count portion of parsed_rows to equal the value of the incremented pg_load variable:
		parsed_rows.page_count = pg_load;
		// turn updated parsed_rows variable back to a JSON-style string:
		var stringed_row = JSON.stringify(parsed_rows);
		// update cookie_key_json table to reflect incremented page count data:
		db.run_smart("UPDATE cookie_key_json SET session_data = '" + stringed_row + "' WHERE cookie_key = \"" + browser_cookie_key + "\"", function(err, rows_from_update) {

			callback(pg_load);
		});
	});
};


require('/home/ruby/Projects/runcible/routes/helper_func/get_pg_load');

/*
~~~
~~~~~
~~~~~~~
~~~~~~~~~
~~~~~~~
~~~~~
~~~
*/
router.get_pg_load('/form', function(req, res, pg_load) {
	console.log('Total Page Loads After Loading New Entry Form Page: ', pg_load);
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
						// pg_load_to_renderer: pg_load,
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

router.get_pg_load('/form_update', function(req, res, pg_load) {
	console.log('Total Page Loads After Loading Update Entry Form Page: ', pg_load);
	db.all(query='SELECT * FROM time_temp WHERE id = ' + req.query.id, function(err, rows_from_db) { 
		console.log("attempted to query database with __" + query + "__");
		res.render('pages/form_update.ejs', {title: 'Form Update', row_to_renderer: rows_from_db[0]});
	});
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



//
//
//
//
// 6 functions that find and define the values of y-axis and labels for x-axis for chartist chart:
// to be used in router.get('/'...): 

// pull the dates logged in time_temp table and populate into array dates_logged (used in comparison_key() ):
function logged_dates(rows_from_db) {
	var dates_logged = [];
	for (var i = 0; i < rows_from_db.length; i++) {
		dates_logged[i] = new Date(rows_from_db[i].datetime);
	}
	//console.log('dates_logged: \n', dates_logged);
	return dates_logged	
}
// pull begin and end datetimes from cycles table and auto-populate a series of dates into full_date_range array (used in comparison_key() and populate_x_axis_labels() ): 
function auto_compute_date_range(next_cycle_id, dates_from_db, rows_from_db) {
	// define beginning datetime based on db query results:
	var begin_datetime = new Date(dates_from_db[0].begin_datetime);
	// define ending datetime based on db query results, with conditions based on whether it's accessing a complete or incomplete cycle (if complete, get end_datetime from 'cycles' table query results, else get from 'time_temp' table query restuls):
	if(next_cycle_id){
		var end_datetime = new Date(dates_from_db[1].end_datetime);
	} else {
		var end_datetime = new Date(rows_from_db[rows_from_db.length-1].datetime);
	}
	var full_date_range = [];
	// create for loop to push full date range (based on beginning and end datetimes) into array full_date_range (this loop does work for time change):
	for (var i = begin_datetime; i <= end_datetime; i.setDate(i.getDate() + 1)) {
		full_date_range.push(new Date(i));
	}
	//console.log('full_date_range: \n', full_date_range);
	// return the date range array for future use elsewhere:
	return full_date_range;
}
// compare dates_logged against full_date_range, and populate a new a_match array with 0's or 1's, depending on whether there's a match (0 == false, 1 == true). this is a helper function for many of the other methods below:
function comparison_key(full_date_range, dates_logged) {
	var a_match = [];
	var count = 0;
	for (var j = 0; j < full_date_range.length; j++) {
		if (full_date_range[j] - dates_logged[count] == 0) { // can't directly compare two date objects, but I can indirectly manipulate their results for comparison
			a_match[j] = 1; // 1 == 'true' match
			count ++;
		} else {
			a_match[j] = 0; // 0 == 'false' clash
		}
	}
	//console.log('a_match: ', a_match);
	return a_match;
}
// pull temp_f data from time_temp table; iterate over a_match (from comparison_key() ): if element is 1, then fill the same-indexed element of y_temp_f array with the temp_f data from time_temp table; else, fill y_temp_f with 'undefined'. y_temp_f feeds directly to chartist chart, and the undefined elements show up as gaps in the chart: 
function populate_y_axis_data(a_match, rows_from_db) {
	var y_temp_f = [];
	var count = 0;
	for (var i = 0; i < a_match.length; i++) {
		if (a_match[i] == 1) { // if match == true
			y_temp_f[i] = rows_from_db[count].temp_f;
			count ++;
		} else { // if match == false
			y_temp_f[i] = undefined;
		}
	}
	//console.log('y_temp_f: ', y_temp_f);
	return y_temp_f;
}
// pull time_taken data from time_temp table; iterate over a_match(from comparison_key() ): if element is 1, then fill the same-indexed element of x_time_taken array with the time_taken data from time_temp table; else, fill x_time_taken with '' empty string. x_time_taken array will be used later in populate_x_axis_labels() to populate the labels for the x-axis of chartist chart:  
function logged_time_taken(a_match, rows_from_db) {
	var x_time_taken = [];
	var count = 0;
	for (var i = 0; i < a_match.length; i++) {
		if (a_match[i] == 1) { // if match == true
			x_time_taken[i] = rows_from_db[count].time_taken;
			count ++;
		} else { // if match == false
			x_time_taken[i] = "_____";
		}
	}
	//console.log('x_time_taken: ', x_time_taken);
	return x_time_taken;
}
// populate the labels for the x-axis of chartist chart with array x_label_values.  Include data from full_date_range (from auto_compute_date_range() ) and x_time_taken (from logged_time_taken() ), with gaps in data as appropriate (the time_taken value is just an empty string '' if there's no y-axis temp_f, for instance): 
function populate_x_axis_labels(full_date_range, x_time_taken) {
	var x_label_values = []
	var cycle_count = 1;
	var count = 0;
	var days_of_the_week = ["S", "M", "T", "W", "T", "F", "S"];
	for (var i = 0; i < full_date_range.length; i++) {
		// define to individual variables for simplicy: 
		var month = (full_date_range[i].getMonth() + 1);
		var date = full_date_range[i].getDate();
		var day = days_of_the_week[full_date_range[i].getDay()];
		//var time_taken = rows_from_db[i].time_taken;
		var time_taken = x_time_taken[i];
		// full_string_dates[i] = (full_date_range[i].getMonth() + 1) + "-" + full_date_range[i].getDate();
		x_label_values[i] = "\"" + cycle_count + "\\n" + day + "\\n" + month + "-" + date + "\\n" + time_taken + "\"";
		// x_label_values[i] = "\"" + month + "-" + date + "\\n" + time_taken + "\"";
		cycle_count ++;
	}
	//console.log('x_label_values: \n', x_label_values);
	return x_label_values;
}




/*
~~~
~~~~~
~~~~~~~
~~~~~~~~~
~~~~~~~
~~~~~
~~~
*/
// access and route info for index.ejs to render home page of app.  includes functions that helps determine which cycle chart to show on the page (more deets below and in comments for supporting functions):
router.get_pg_load('/', function(req, res, pg_load) {
	// print onto terminal browser's cache of cookies: 
	console.log("Cookies from browser: ", req.cookies);
	// store broswer's cache of cookies onto server variable: 
	cookie_var = req.cookies
	// print onto terminal the server variable: 
	console.log("cookie_var: ", cookie_var);
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
			db.all('SELECT *, strftime(\'%m/%d\', date) as \'month_day\', strftime(\'%Y-%m-%d %H:%M:%S\', date) as \'datetime\' FROM time_temp WHERE cycle_id = "' + which_cycle_id + '" ORDER BY date', function(err, rows_from_db) { 
//console.log(rows_from_db[rows_from_db.length-1].date);
					// variables for query below with conditions so that the query doesn't break if next_cycle_id is undefined (ie, if the page is displaying the final cycle and there is no next cycle created yet): 
					var id_search_var = 0;
					if (next_cycle_id) {
						id_search_var = next_cycle_id;
					} else {
						id_search_var = which_cycle_id; // simply assigning id_search_var to something that I know won't be undefined and break the query below
					};

					// query to find beginning and end dates of currently displayed cycle: 
					// query creates two different datetime formats for begin and end variables: one that's pretty on the webpage, and one that works better with javascript date methods:
					/*
					query creates results formatted like the ones below: 
						2012-09-23|2012-09-22|2012-09-23 00:00:00|2012-09-22 00:00:00
						2012-10-23|2012-10-22|2012-10-23 00:00:00|2012-10-22 00:00:00
					*/
					db.all('SELECT begin_date, date(begin_date, \'-1 day\') as \'end_date\', strftime(\'%Y-%m-%d %H:%M:%S\', begin_date) as \'begin_datetime\', strftime(\'%Y-%m-%d %H:%M:%S\', begin_date, \'-1 day\') as \'end_datetime\' FROM cycles WHERE id = ' + which_cycle_id + ' or id = ' + id_search_var + ' ORDER BY begin_date', function(err, dates_from_db){
						if (next_cycle_id) {
							var begin_date = dates_from_db[0].begin_date;
							var end_date = dates_from_db[1].end_date;
						} else {
							var begin_date = dates_from_db[0].begin_date;
							var end_date = rows_from_db[rows_from_db.length-1].date; // assign an actual value to end_date (gleaned from time_temp most recent row), to make chartist labels display correctly (they depend on begin_date and end_date values, and raw string 'today' would have made that dependency wonky
						};


						var dates_logged = logged_dates(rows_from_db);
						var full_date_range = auto_compute_date_range(next_cycle_id, dates_from_db, rows_from_db);
						//console.log('full_date_range: ');
						//console.log(full_date_range);
						var a_match = comparison_key(full_date_range, dates_logged);
						var y_temp_f = populate_y_axis_data(a_match, rows_from_db);
						var x_time_taken = logged_time_taken(a_match, rows_from_db);
						var x_label_values = populate_x_axis_labels(full_date_range, x_time_taken);






					// res.render sends various variables to index.ejs and its dependent pages:
					res.render('pages', {
						title: 'Home', 
						// rough hack: attempt to prevent homepage from breaking when there's a new cycle that has no child entries: if the 0-th element of rows_from_db exists, link rows_to_renderer to rows_from_db, otherwise, link rows_to_renderer to empty array object:
						rows_to_renderer: rows_from_db[0] ? rows_from_db : [{}], 
						//date_temp_object_to_renderer: date_temp_object,
						// render beginning and end dates of currently displayed cycle to index.ejs:
						begin_date_to_renderer: begin_date,
						end_date_to_renderer: end_date,
						// date_range_int_to_renderer: date_range_int,
						y_temp_f_to_renderer: y_temp_f, 
						x_label_values_to_renderer: x_label_values,
						pg_load_to_renderer: pg_load,
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

router.post_pg_load('/formpost', function(req, res, pg_load) {
	console.log('Total Page Loads After Posting New Entry Form Page: ', pg_load);
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
});


router.post_pg_load('/deletepost', function(req, res, pg_load) {
	console.log('Total Page Loads After Posting Update Entry Form Page: ', pg_load);
	var query = "";
	db.all(query="DELETE FROM time_temp WHERE id=" + req.body["id_home"], function(err, rows) {
		console.log("attempted to delete with ((" + query + "))");
		//res.redirect('/');
		// redirect to the cycle of the row I just deleted (not defaulting to most recent cycle): 
		res.redirect('/?cycle=' + req.body["cycle_id"]);
	});
});

router.post_pg_load('/form_post_update', function(req, res, pg_load) {
	console.log('Total Page Loads After Posting Update Entry Form Page: ', pg_load);
	var query = "";
	db.all(query="UPDATE time_temp SET date=\"" + req.body["date"] + "\", time_taken=\"" + req.body["time_taken"] + "\", temp_f=" + req.body["temp_f"] + ", cycle_id=" + req.body["cycle_id"] + " WHERE id=" + req.body["id"], function(err, rows) {
		console.log("attempted to update with ((" + query + "))");
		// redirect to the cycle of the row I just updated (not defaulting to most recent cycle): 
		res.redirect('/?cycle=' + req.body["cycle_id"]);
	});
});


router.get('/cookie', function(req,res){
	// sets the initial cookie by hand for testing purposes: 
	res.setHeader('Set-Cookie', cookie.serialize('cookie_key', 'aaa111'));
	// save browser's cookie to browser_cookie_key via req.cookies:
	var browser_cookie_key = req.cookies;
	console.log("browser_cookie_key: ", browser_cookie_key);
	// access db table to verify whether browser_cookie_key.cookie_key matches any entries:
	db.run_smart("SELECT session_data FROM cookie_key_json WHERE cookie_key = \"" + browser_cookie_key.cookie_key + "\"", function(err, rows) {
		console.log("rows: ", rows);
		// if cookie doesn't match any db table entries, for now, print to console a message saying so:
		if (rows.length == 0) {
			console.log("rows.length == 0: no match");
		// if cookie does match a db table entry, for now, print to console a message saying so:
		} else { // if (rows.length != 0)
			console.log("there's a match!");
			console.log(rows);
		}
	});
	res.send('Cookie\'s sent!');
});

router.get('/clearcookie', function(req,res){
	// remove page_loads cookie from browser cache (and subsequently from the server's attempts to access browser's cache): 
	res.clearCookie('cookie_key');
	// send a message to the web page to let the user know something happened: 
	res.send('Cookie deleted');
});

app.listen(3000, function() {
	console.log('index.js listening on port 3000!');
});


