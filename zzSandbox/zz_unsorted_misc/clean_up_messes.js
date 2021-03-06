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

// NEW FUNCTION!!!!
function db_query_func(cycle_id_marker) {
	db.all('SELECT * FROM time_temp WHERE cycle_id = "' + cycle_id_marker + '" ORDER BY date', function(err, rows_from_db) { 
		res.render('pages', {
			title: 'Home', 
			rows_to_renderer: rows_from_db, 
			cycle_id_to_renderer: {
				prev: previous_cycle, 
				curr: current_cycle, 
				next: next_cycle, 
				first: first_cycle, 
				last: last_cycle
			}
		});
	});
};

router.get('/', function(req, res) {
	// defines cycle_id_var as integer, which will be used as a marker in determining which cycle to query later on
	var cycle_id_var = 0;
	// get current cycle from data in query string passed through URL from index.ejs:
	var current_cycle = req.query.cycle;
	// cycle_brackets() defined in function above

  the ternary/trinary operator? is that even its name?
  var result = if_this ? then_this : otherwise_this;

  var result = some_value_that_may_be_null ? some_value_that_may_be_null : some_fallback_value;
	// this might be called ''OR' short-circuiting to select fallback value': 
  || or OR
  var result = some_value_that_may_be_null || some_fallback_value || this_one;

	cycle_brackets(current_cycle, function(previous_cycle, next_cycle, first_cycle, last_cycle) {
		function db_query_func(cycle_id_marker) {
			db.all('SELECT * FROM time_temp WHERE cycle_id = "' + cycle_id_marker + '" ORDER BY date', function(err, rows_from_db) { 
				res.render('pages', {
					title: 'Home', 
					rows_to_renderer: rows_from_db, 
					cycle_id_to_renderer: {
						prev: previous_cycle, 
						curr: current_cycle, 
						next: next_cycle, 
						first: first_cycle, 
						last: last_cycle
					}
				});
			});
		};
		// if req.query.cycle isn't false, null, or undefined, it populates the page based on that current_cycle value; if not, then it defaults to the most recent cycle. In both cases relevant info is passed onto index.ejs via res.render in key:value pairs:
		if (req.query.cycle) {		
			cycle_id_var = current_cycle
			db_query_func(cycle_id_var)
		} else { 
			cycle_id_var = last_cycle
			db_query_func(cycle_id_var)
		};
	});
});
