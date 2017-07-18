function cycle_id_array_async() {
	db.all('SELECT id FROM cycles ORDER BY begin_date DESC'), function(err, rows_from_db) {
		
	};
};

// result of query: [{id: 2}, {id: 5}, {id: 4}, {id: 3}, {id: 1}]


function cycle_id_array_func() {
	db.all('SELECT id FROM cycles ORDER BY begin_date DESC'), function(err, rows_from_db) {
		// empty array to hold the id's (in descending-date-order) of "cycles" table:
		var cycle_id_array = []; 
		// finds the length of the array-object returned by the sql query, and pops that into the for loop length:
		var cycles_length = rows_from_db.length; 
		for (i = 0; i < cycles_length; i++) {
			// populate cycle_id_array with index values of sql query results:
			cycle_id_array[i] = rows_from_db[i].id; 
		};
	return cycle_id_array;
	};
};

function cycle_brackets(cycle_id_array, current_cycle_id, callback) {
	var current_cycle_id_index = 0; 
	var cycles_length = cycle_id_array.length;
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
