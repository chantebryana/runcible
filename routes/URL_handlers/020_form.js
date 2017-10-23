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
