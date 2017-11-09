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


