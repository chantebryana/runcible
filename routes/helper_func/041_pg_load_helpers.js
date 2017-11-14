/*
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
*/

increment_pg_load = function increment_pg_load(session_data, increment_callback) {
	if (!session_data.pg_load) { // if pg_load key doesn't exist, create it and set its value to 1. call `increment_callback` to move things forward w/ asynchronous flow (no need to pass updated `session_data` b/c that pointer value automatically gets updated)
		session_data.pg_load = 1;
		increment_callback();
	} else {	// if pg_load key already exists, increment its value by 1 and call `increment_callback` to move things along
		session_data.pg_load += 1;
		increment_callback();
	}
};


save_session_data = function save_session_data(session_data, res, browser_key, save_callback) {
	var browser_key = browser_cookie;
	var session_string = JSON.stringify(session_data);
	db.run_smart("UPDATE cookie_key_json SET session_data = ? WHERE cookie_key = ?", session_string, browser_key.cookie_key, function (err, rows) {
		save_callback();
		});
};
