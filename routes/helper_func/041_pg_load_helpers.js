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
