// helper functions for user authentication protocol in login_post.js

// if a user logs in correctly, their unauthorized session becomes authorized (by setting user_auth to true): 
authorize_db_session_data = function authorize_db_session_data(cookie_key, session_data, callback) {
	session_data.user_auth = "true"; // JE: pointer to user_auth variable within session_data object is manipulated -- a new copy of session_data isn't created over top the old one. long story short, I'll have access to the updated session_data elswhere in my code b/c of pointers -- I don't need to manually pass forward what I've changed here. This also means I don't have to include any arguments within the callback on line 8.
	session_string = JSON.stringify(session_data);
	db.run_smart("UPDATE cookie_key_json SET session_data = ? WHERE cookie_key = ?", session_string, cookie_key, function(err, rows) {
		callback();
	});
};


