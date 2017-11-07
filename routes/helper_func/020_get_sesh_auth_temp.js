// first crack at assembling function set for get_with_session
// (refer to `docs/20171103 Jim wrapper notes.js` for more info

// make and return a 6-character case-sensitive-alpha-numeric string (new cookie key): 
make_id = function make_id() {
	var text = "";
	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	for (var i = 0; i < 6; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	};
	return text;
}

// insert new key and session data entry into db table. pass session_data variable forward via callback: 
insert_new_key_to_db = function insert_new_key_to_db(new_key, callback) {
	var session_obj = {user_auth:"false"};
	var session_string = JSON.stringify(session_obj);
	db.run_smart("INSERT INTO cookie_key_json (cookie_key, session_data) VALUES(?, ?)", new_key, session_string, function(err, rows) {
		callback(session_obj);
	});
}

// save new key to browser's cookie cache: 
save_new_key_to_browser = function save_new_key_to_browser(res, new_key){
	res.setHeader('Set-Cookie', cookie.serialize('cookie_key', new_key));
}

//
//
//
//
// Somehow make sure that there's a cookie key that matches between the browser and the database table. Create one if it needs to be created. Either way, pass the session_data forward via callbacks. 
find_or_start_session = function find_or_start_session(req, res, session_callback) {
	browser_cookie = req.cookies;
	if (!browser_cookie.cookie_key) { // if there is no `browser_cookie`
		// make and save an unauthorized one
		var new_key = make_id();
		insert_new_key_to_db(new_key, function(session_obj) {
			save_new_key_to_browser(res, new_key);
			session_callback(session_obj);
		});
	} else { // if there is a browser cookie
		// check it against the database
		db.run_smart("SELECT session_data FROM cookie_key_json WHERE cookie_key = ?", browser_cookie.cookie_key, function(err, rows) {
			if (rows.length == 0) { // if query results are invalid, make and save a new unauthorized one 
				var new_key = make_id();
				insert_new_key_to_db(new_key, function(session_obj) {
					save_new_key_to_browser(res, new_key);
					session_callback(session_obj);
				});
			} else { // if the `browser_cookie` matches a record in the db table
				var session_parsed = JSON.parse(rows[0].session_data);
				session_callback(session_parsed);
			}
		}); 
	}
};

// `get` wrapper that identifies or creates session_data:
router.get_with_session = function get_with_session(url, url_handler_callback) {
	this.get(url, function (req, res) {
		find_or_start_session(req, res, function (session_data) {
			url_handler_callback(req, res, session_data);
		});
	});
};

// first crack at assembling function set for get_with_auth
// (refer to `docs/20171103 Jim wrapper notes.js` for more info

// redirects to login page if session_data isn't authorized, else it passes namespace arguments (res, req, session_data) forward:
function stay_or_redirect(res, session_data, callback) {
	if (session_data.user_auth != 'true') {
		return res.redirect("/login");
	} else {
		callback();
	}
};

// `get` wrapper that 1) identifies or creates session_data (`get_with_session`) and 2) redirects to login page (if unauthorized) or stays put:
router.get_with_auth = function get_with_auth(url, handler_callback) {
	this.get_with_session(url, function (req, res, session_data) {
		stay_or_redirect(res, session_data, function () {
			handler_callback(req, res, session_data);
		});
	});
};
