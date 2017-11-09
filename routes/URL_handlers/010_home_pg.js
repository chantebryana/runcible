// access and route info for index.ejs to render home page of app.  includes functions that helps determine which cycle chart to show on the page (more deets below and in comments for supporting functions):
router.get_with_auth('/', function(req, res, session_data) {

//
//
	increment_pg_load(session_data, function(this_session) {

//
//

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
			// db query to look up the data for the current cycle, based on the values returned on the previous steps: 
			db.all('SELECT *, strftime(\'%m/%d\', date) as \'month_day\', strftime(\'%Y-%m-%d %H:%M:%S\', date) as \'datetime\' FROM time_temp WHERE cycle_id = "' + which_cycle_id + '" ORDER BY date', function(err, rows_from_db) { 
				// variables for query below with conditions so that the query doesn't break if next_cycle_id is undefined (ie, if the page is displaying the final cycle and there is no next cycle created yet): 
				var id_search_var = 0;
				if (next_cycle_id) {
					id_search_var = next_cycle_id;
				} else {
					id_search_var = which_cycle_id; // simply assigning id_search_var to something that I know won't be undefined and break the query below
				};
				// db query to get beginning and end date/datetimes from cycles table (used for proper layout of chart):
				db.all('SELECT begin_date, date(begin_date, \'-1 day\') as \'end_date\', strftime(\'%Y-%m-%d %H:%M:%S\', begin_date) as \'begin_datetime\', strftime(\'%Y-%m-%d %H:%M:%S\', begin_date, \'-1 day\') as \'end_datetime\' FROM cycles WHERE id = ' + which_cycle_id + ' or id = ' + id_search_var + ' ORDER BY begin_date', function(err, dates_from_db){
					// use results of db query to assign the beginning and end dates to a variable, to be used in the functions in the next section. All of this is to properly populate the labels and data for the chart: 
					if (next_cycle_id) {
						var begin_date = dates_from_db[0].begin_date;
						var end_date = dates_from_db[1].end_date;
					} else {
						var begin_date = dates_from_db[0].begin_date;
						var end_date = rows_from_db[rows_from_db.length-1].date; // assign an actual value to end_date (gleaned from time_temp most recent row), to make chartist labels display correctly (they depend on begin_date and end_date values, and raw string 'today' would have made that dependency wonky
					};
					// following 6 variables store data generated in 6 functions, all of which will be used to populate labels and data for the chart: 
					var dates_logged = logged_dates(rows_from_db);
					var full_date_range = auto_compute_date_range(next_cycle_id, dates_from_db, rows_from_db);
					var a_match = comparison_key(full_date_range, dates_logged);
					var y_temp_f = populate_y_axis_data(a_match, rows_from_db);
					var x_time_taken = logged_time_taken(a_match, rows_from_db);
					var x_label_values = populate_x_axis_labels(full_date_range, x_time_taken);

//
//

					var render_contents = {
						title: 'Home', 
						// rough hack: attempt to prevent homepage from breaking when there's a new cycle that has no child entries: if the 0-th element of rows_from_db exists, link rows_to_renderer to rows_from_db, otherwise, link rows_to_renderer to empty array object:
						rows_to_renderer: rows_from_db[0] ? rows_from_db : [{}], 
						// render beginning and end dates of currently displayed cycle to index.ejs:
						begin_date_to_renderer: begin_date,
						end_date_to_renderer: end_date,
						y_temp_f_to_renderer: y_temp_f, 
						x_label_values_to_renderer: x_label_values,
						//pg_load_to_renderer: pg_load,
						cycle_id_to_renderer: {
							prev: previous_cycle_id, 
							curr: current_cycle_id, 
							next: next_cycle_id, 
							first: first_cycle_id, 
							last: last_cycle_id
						}
					};

					//res.render_pg_load('pages', render_contents, req, this_session, session_data);
					// JE: this is a replacement for the double-redundant `res.render`s in the if/else branches below: `final_render_step = function() {res.render('pages', render_contents)};`
					final_render_step = function() {res.render('pages', render_contents);};

// lines 76 thru 87 as `save_session_data(final_render_step);` ---or--- `save_session_data(function(){res.render('pages', render_contents)});`. arguments to pass through s_s_d(): session_data, this_session, req.cookies, callback 

					// if local session data doesn't match database's session_data, then stringify to JSON object and run an UPDATE query
					if (this_session != session_data) {
						var browser_key = req.cookies;
						var session_string = JSON.stringify(this_session);
						console.log("end, if branch: browser_key.cookie_key: " + browser_key.cookie_key + "; session_string: " + session_string);
						db.run_smart("UPDATE cookie_key_json SET session_data = ? WHERE cookie_key = ?", session_string, browser_key.cookie_key, function (err, rows) {
							// CE: how to manage res.render for if/else branches??
							//res.render('pages', render_contents);
							final_render_step();
						});
					} else {
						console.log("end, else branch");
						//res.render('pages', render_contents);
						final_render_step();
					}

//
//
/*
					// res.render sends various variables to index.ejs and its dependent pages:
					res.render('pages', {
						title: 'Home', 
						// rough hack: attempt to prevent homepage from breaking when there's a new cycle that has no child entries: if the 0-th element of rows_from_db exists, link rows_to_renderer to rows_from_db, otherwise, link rows_to_renderer to empty array object:
						rows_to_renderer: rows_from_db[0] ? rows_from_db : [{}], 
						// render beginning and end dates of currently displayed cycle to index.ejs:
						begin_date_to_renderer: begin_date,
						end_date_to_renderer: end_date,
						y_temp_f_to_renderer: y_temp_f, 
						x_label_values_to_renderer: x_label_values,
						//pg_load_to_renderer: pg_load,
						cycle_id_to_renderer: {
							prev: previous_cycle_id, 
							curr: current_cycle_id, 
							next: next_cycle_id, 
							first: first_cycle_id, 
							last: last_cycle_id
						}
					});
*/
				});
			});
		});
	});
//
//
	});
//
//
});
