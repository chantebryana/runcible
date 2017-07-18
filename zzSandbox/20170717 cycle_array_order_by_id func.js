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

router.get('/', function(req,res) {
	get_first_and_last_cycle_id(function(first_cycle_id, last_cycle_id){
		console.log('first_cycle_id: ' + first_cycle_id + ', last_cycle_id: ' + last_cycle_id + '\n');
	});
});


router.get('/', function(req,res) {
	get_cycle_id_by_date(function (cycle_id_array){
		var first_cycle_id = cycle_id_array[cycle_id_array.length-1];
		var last_cycle_id = cycle_id_array[0];
		console.log('first_cycle_id: ' + first_cycle_id + ', last_cycle_id: ' + last_cycle_id + '\n');
	});
});

function find_next_previous_cycle(current_cycle_id, callback) {
	get_cycle_id_by_date(function (cycle_id_array){
		
	});
};


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
