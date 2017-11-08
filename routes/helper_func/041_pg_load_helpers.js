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
