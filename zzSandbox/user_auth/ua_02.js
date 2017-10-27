// pseudocode notepad!! based on outline notes from EOD 2017-10-30

function new_session_row(new_cookie_key, callback) {
	db.run_smart("INSERT INTO browser_session (cookie_key, session_data) VALUES (\"" + new_cookie_key + "\", '{\"user_auth\":\"false\"}')", function(err, rows) {
		callback(/*arg?*/);
	});
};

function user_auth_true(browser_cookie_key, callback) {
	db.run_smart("UPDATE browser_session SET session_data = '{\"user_auth\":\"true\"}' WHERE cookie_key = \"" + browser_cookie_key + "\"", function(err, rows) {
		callback(/*arg?*/);
	});
};


// what if this browser_session already exists in the db table? how do the two functions nest together? the callbacks are all wrong I'm sure: how to make them do what they're supposed to do? how do adapt these functions as the session_data field gets more complicated (I'd need to store and pass that variable around, just like the cookie_key variable). 
// all good questions, but don't get lost in the minutia just yet.

// i suppose if there's already a browser_cookie_key, then I wouldn't even perform new_session_row, because that's already been done! I'd just perform user_auth_true, which, incidentally, is how I outlined it yesterday. I suppose it can take a while for my brain to catch up.

function stuff(/*arg?*/) {
	if (browser_cookie == false) { // or however I decide to save and pass that data forward from check_browser_cookie()
		var new_key = make_id();
		save_new_cookie_id_to_browser(res, new_key);
		new_session_row(new_key, function(/*arg?*/){
			callback(/*arg?*/);
		});
	} else { // if there's already an inauthenticated browser session
		user_auth_true(browser_cookie_key, function (/*arg?*/) {
			callback(/*arg?*/);
		});
	}
};
