// helper functions for user authentication protocol in login_post.js

// if a user logs in correctly, their unauthorized session becomes authorized (by setting user_auth to true): 
authorize_db_session_data = function authorize_db_session_data(cookie_key, session_data, callback) {
	session_data.user_auth = "true";
	session_string = JSON.stringify(session_data);
	db.run_smart("UPDATE cookie_key_json SET session_data = ? WHERE cookie_key = ?", session_string, cookie_key, function(err, rows) {
		callback(session_data);
	});
};


