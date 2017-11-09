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

/*
// pseudocode framework for workflow black box structure Jim mentioned yesterday (rignt now it lives on line 74 of home_pg.js)
func_name = function func_name (stuff, stuff, callback) {
	if () {
		do stuff
		do stuff
		callback(pg_session);
	} else {
		callback(pg_session);
	}
}

// pseudocode framework for implementing (in home_pg.js) the function outlined above: 
func_name(stuff, stuff, function() {
	final_render_step();
});
*/
// attempt at actual session_save code: 
save_session_data = function save_session_data(session_data, pg_session, browser_cookie, save_callback) {
	if (pg_session != session_data) {
		var browser_key = browser_cookie;
		var session_string = JSON.stringify(pg_session);
		db.run_smart("UPDATE cookie_key_json SET session_data = ? WHERE cookie_key = ?", session_string, browser_key.cookie_key, function (err, rows) {
			save_callback(pg_session);
		});
	} else {
			save_callback(pg_session);
	}
};

/*
// attempt at actual implementation of session_save: 
save_session_data(session_data, pg_session, req.cookies, function(this_session) {
	final_render_step();
});
*/

/*
ok, the earlier commit must have been failing silently: a few changes created bunches of errors!
CE: some terminal errors

ruby@ubuntu:~/projects/runcible$ node routes/index.js 
010_run_smart.js
020_get_sesh_auth_helpers.js
030_get_post_with_session.js
031_get_post_with_auth.js
040_login_post_helper.js
041_pg_load_helpers.js
050_id_date_range_helpers.js
060_x-y_axis_helpers.js
index.js listening on port 3000!
find_or_start_session() is running!
foss() -> if there is a browser_key and if it does match db
stay_or_redirect() -> authorized session data
/home/ruby/projects/runcible/routes/helper_func/041_pg_load_helpers.js:74
		var session_string = JSON.stringify(this_session);
		                                    ^

ReferenceError: this_session is not defined
    at save_session_data (/home/ruby/projects/runcible/routes/helper_func/041_pg_load_helpers.js:74:39)
    at Statement.<anonymous> (/home/ruby/projects/runcible/routes/URL_handlers/010_home_pg.js:51:6)
ruby@ubuntu:~/projects/runcible$ node routes/index.js 
010_run_smart.js
020_get_sesh_auth_helpers.js
030_get_post_with_session.js
031_get_post_with_auth.js
040_login_post_helper.js
041_pg_load_helpers.js
050_id_date_range_helpers.js
060_x-y_axis_helpers.js
index.js listening on port 3000!
find_or_start_session() is running!
foss() -> if there is a browser_key and if it does match db
stay_or_redirect() -> authorized session data
/home/ruby/projects/runcible/routes/helper_func/041_pg_load_helpers.js:33
	res.render('pages', {
	^

ReferenceError: res is not defined
    at final_render_step (/home/ruby/projects/runcible/routes/helper_func/041_pg_load_helpers.js:33:2)
    at /home/ruby/projects/runcible/routes/URL_handlers/010_home_pg.js:52:7
    at /home/ruby/projects/runcible/routes/helper_func/041_pg_load_helpers.js:76:4
    at Statement.arguments.(anonymous function) (/home/ruby/projects/runcible/routes/helper_func/010_run_smart.js:10:6)

*/
