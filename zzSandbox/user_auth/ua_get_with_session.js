// first crack at assembling function set for get_with_session
// (refer to `docs/20171103 Jim wrapper notes.js` for more info

find_or_start_session = function find_or_start_session(req, res, session_callback) {
	browser_cookie = req.cookies;
	if (!browser_cookie.cookie_key) { // if there is no `browser_cookie`
		// make and save an unauthorized one
		var new_key = make_id();
		insert_new_key_to_db(new_key, function () {
			save_new_key_to_browser(res, new_key);
			session_callback('{"user_auth":"false"}'); // CE: instead of passing a string, I could add an extra layer in `insert_new_key_to_db` where I also do a `select` query and return/pass-forward the `session_data` variable.
		});
	} else { // if there is a browser cookie
		// check it against the database
		db.run_smart("SELECT session_data FROM cookie_key_json WHERE cookie_key = \"" + browser_cookie.cookie_key + "\"", function(err, rows) {
			if (rows.length == 0) { // if it's invalid, make and save a new unauthorized one (?) -- ask Jim maybe
				var new_key = make_id();
				insert_new_key_to_db(new_key, function () {
					save_new_key_to_browser(res, new_key);
					session_callback('{"user_auth":"false"}'); // CE: instead of passing a string, I could add an extra layer in `insert_new_key_to_db` where I also do a `select` query and return/pass-forward the `session_data` variable.
				});
			} else { // if the `browser_cookie` matches a record in the db table
				session_callback(rows[0].session_data);
			}
		}); 
	}
};


router.get_with_session = function get_with_session(url, url_handler_callback) {
	this.get(url, function (req, res) {
		find_or_start_session(req, res, function (session_data) {
			url_handler_callback(req, res, session_data);
		});
	});
};
