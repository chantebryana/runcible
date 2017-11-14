// create separate variable to store session_data changes:
increment_pg_load = function increment_pg_load(session_data, pg_session_callback) {
	var pg_session = new Object; // gotta point to new memory
	// manually (for now) copy over each value of session_data object:
	pg_session.user_auth = session_data.user_auth;
	pg_session.pg_load = session_data.pg_load;
	// increment pg_load session data:
	if (!pg_session.pg_load) { // if pg_load key doesn't exist, create it and set its value to 1 and pass forward object via callback:
		pg_session.pg_load = 1;
		pg_session_callback(pg_session);
	} else { // if pg_load key already exists, increment its value by 1 and pass forward object via callback:
		pg_session.pg_load += 1;
		pg_session_callback(pg_session);
	}
};

/*
// CE: (failed) attempt to wrap if/else res.render branches at the end of home_pg.js into its own black box. got error messages and doesn't work. Jim provided some feedback (in notes of home_pg.js) to give me stuff to latch onto while I move forward.
res.render_pg_load = function render_pg_load(view, locals, req, pg_session, session_data) {
	if (pg_session != session_data) {
		var browser_key = req.cookies;
		var session_string = JSON.stringify(pg_session);
		db.run_smart("UPDATE cookie_key_json SET session_data = ? WHERE cookie_key = ?", session_string, browser_key.cookie_key, function (err, rows) {
			this.render(view, locals);
		});
	} else {
		this.render(view, locals);
	}
}
*/
/*
final_render_step = function() {
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
};
*/

save_session_data = function save_session_data(session_data, pg_session, res, browser_key, save_callback) {
	var browser_key = browser_cookie;
	var session_string = JSON.stringify(pg_session);
	db.run_smart("UPDATE cookie_key_json SET session_data = ? WHERE cookie_key = ?", session_string, browser_key.cookie_key, function (err, rows) {
		save_callback();
		});
};
