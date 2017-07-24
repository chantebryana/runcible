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

