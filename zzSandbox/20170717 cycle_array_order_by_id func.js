// queries 'cycles' table, receives an array of objects made up of id's of cycle table based on begin_date descending (ie, something like this: [{id: 2}, {id: 5}, {id: 4}, {id: 3}, {id: 1}] ), then calls back that ordered-by-date array to be used in later functions:
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

function get_first_and_last_cycle_id(callback) {
	get_cycle_id_by_date(function(cycle_id_array){
		var first_cycle_id = cycle_id_array[cycle_id_array.length-1];
		var last_cycle_id = cycle_id_array[0];
//		console.log('first_cycle_id: ' + first_cycle_id + ', last_cycle_id: ' + last_cycle_id + '\n');
		callback(first_cycle_id, last_cycle_id);
	});
};

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

router.get('/', function(req,res) {
	var current_cycle_id = req.query.cycle;
	get_first_and_last_cycle_id(function(first_cycle_id, last_cycle_id){
		find_next_previous_cycle(current_cycle_id, function(previous_cycle_id, next_cycle_id){
			var which_cycle_id = last_cycle_id;
			if (req.query.cycle) {
				which_cycle_id = current_cycle_id;
			};
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
/*
router.get('/', function(req,res) {
	get_first_and_last_cycle_id(function(first_cycle_id, last_cycle_id){
		console.log('first_cycle_id: ' + first_cycle_id + ', last_cycle_id: ' + last_cycle_id + '\n');
//	});
		find_next_previous_cycle(5, function(previous_cycle_id, next_cycle_id){
			console.log('previous_cycle_id: ' + previous_cycle_id + ', next_cycle_id: ' + next_cycle_id + '\n');
		});
	});
});

router.get('/', function(req,res) {
	get_cycle_id_by_date(function (cycle_id_array){
		var first_cycle_id = cycle_id_array[cycle_id_array.length-1];
		var last_cycle_id = cycle_id_array[0];
		console.log('first_cycle_id: ' + first_cycle_id + ', last_cycle_id: ' + last_cycle_id + '\n');
	});
});


function cycle_brackets(cycle_id_array, current_cycle_id, callback) {
	var current_cycle_id_index = 0; 
	for (i = 0; i < cycle_id_array.length; i++) {
		if (cycle_id_array[i] == current_cycle_id) { 
			current_cycle_id_index = i;
		};
	};
	var previous_cycle_id = cycle_id_array[current_cycle_id_index + 1];
	var next_cycle_id = cycle_id_array[current_cycle_id_index - 1];
	console.log("current_cycle_id_index: " + current_cycle_id_index);
	console.log("previous: " + previous_cycle_id + ", next: " + next_cycle_id);
	callback(previous_cycle_id, next_cycle_id);
};

router.get('/'...) {
	...
	var current_cycle = req.query.cycle;
	cycle_brackets(cycle_id_array_func(), current_cycle, function(...)) {
		...
		//var cycle_id_array = cycle_id_array_func();
		//var 
		...
	};
	...
};
*/
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
	//cycle_brackets(cycle_id_array_func(), current_cycle, function(previous_cycle, next_cycle, first_cycle, last_cycle) {
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

// ===	===	===

// form.ejs
// '/formpost' in index.js
// new cycle pseudocode

	// if a new cycle is being initiated:
	if(req.body["cycle_id"] == new_cycle) {
		// insert new name and begin_date to cycles table (which will auto-generate an id): 
		db.all("INSERT INTO cycles (name, begin_date) VALUES(\"" + req.body["name"] + "\", \"" + req.body["date"]+ "\")", function(err, rows_from_cycles_insert) {
			// look up the new cycle I just created to find out what the new id is:
			db.all("SELECT * FROM cycles WHERE name = \"" + req.body["name"] + "\")", function(err, rows_from_cycles_select) {
				// also insert new entry data into time_temp table, using the new cycle id I just looked up to link the child entry to the parent entry:
				var new_cycle_id = rows_from_cycles_select[0].id;
				db.all("INSERT INTO time_temp(date, time_taken, temp_f, cycle_id) VALUES( \"" + req.body["date"] + "\", \"" + req.body["time_taken"] + "\", \"" + req.body["temp_f"] + "\", \"" + "\" new_cycle_id)", function(err, rows_from_time_temp) {
					// after conducting all this brain work, redirect to home page: 
					res.redirect('/');
				});
			});
		});
	// or else if cycle_id equals the id of an already existing cycle: 
	} else {
		// insert new entry data into time_temp (including cycle_id of existing cycle): 
		db.all("INSERT INTO time_temp (date, time_taken, temp_f, cycle_id) VALUES( \"" + req.body["date"] + "\", \"" + req.body["time_taken"] + "\", \"" + req.body["temp_f"] + "\", \"" + req.body["cycle_id"] + "\")", function(err, rows_from_time_temp) {
			// after conducting this brain work, redirect to home page: 
			res.redirect('/');
		});
	}

