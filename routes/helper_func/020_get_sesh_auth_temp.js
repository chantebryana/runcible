// first crack at assembling function set for get_with_session
// (refer to `docs/20171103 Jim wrapper notes.js` for more info

make_id = function make_id() {
	var text = "";
	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	for (var i = 0; i < 6; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	};
	return text;
}

insert_new_key_to_db = function insert_new_key_to_db(new_key, callback) {
	var sesh_false_obj = {user_auth:"false"};
	var sesh_false_string = JSON.stringify(sesh_false_obj);
	//db.run_smart("INSERT INTO cookie_key_json (cookie_key, session_data) VALUES(\"" + new_key + "\", '" + sesh_false_string +  "')", function(err, rows) { // JE: replace escaped double quotes with literal single quotes (for now): this accounts for the unescaped double quotes within the JSON.stringify-ied variable
	db.run_smart("INSERT INTO cookie_key_json (cookie_key, session_data) VALUES(?, ?)", new_key, sesh_false_string, function(err, rows) {
		callback(sesh_false_obj);
	});
}

save_new_key_to_browser = function save_new_key_to_browser(res, new_key){
	res.setHeader('Set-Cookie', cookie.serialize('cookie_key', new_key));
}

//
//
//
//
find_or_start_session = function find_or_start_session(req, res, session_callback) {
	browser_cookie = req.cookies;
	if (!browser_cookie.cookie_key) { // if there is no `browser_cookie`
		// make and save an unauthorized one
		var new_key = make_id();
		insert_new_key_to_db(new_key, function(sesh_false_obj) {
			save_new_key_to_browser(res, new_key);
			session_callback(sesh_false_obj);
		});
	} else { // if there is a browser cookie
		// check it against the database
		db.run_smart("SELECT session_data FROM cookie_key_json WHERE cookie_key = \"" + browser_cookie.cookie_key + "\"", function(err, rows) { // JE: argument array adaptation to make quote-escaping work (see stackoverflow page) (a first, a last, and an array of middle arguments)
			if (rows.length == 0) { // if it's invalid, make and save a new unauthorized one (?) -- ask Jim maybe
				var new_key = make_id();
				insert_new_key_to_db(new_key, function(sesh_false_obj) {
					save_new_key_to_browser(res, new_key);
					session_callback(sesh_false_obj);
				});
			} else { // if the `browser_cookie` matches a record in the db table
				var sesh_parsed = JSON.parse(rows[0].session_data);
				session_callback(sesh_parsed);
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

// first crack at assembling function set for get_with_auth
// (refer to `docs/20171103 Jim wrapper notes.js` for more info

function stay_or_redirect(res, session_data, callback) {
	if (session_data.user_auth != 'true') {
		return res.redirect("/login");
	} else {
		callback();
	}
};

router.get_with_auth = function get_with_auth(url, handler_callback) {
	this.get_with_session(url, function (req, res, session_data) {
		stay_or_redirect(res, session_data, function () {
			handler_callback(req, res, session_data);
		});
	});
};
