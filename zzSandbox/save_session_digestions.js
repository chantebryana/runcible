router.get_with_auth = function get_with_auth(url, handler_callback) {
	this.get_with_session(url, function (req, res, session_data) {
		stay_or_redirect(res, session_data, function() {
			handler_callback(req, res, session_data);
		});
	});
};
// =>
stay_or_redirect = function stay_or_redirect(res, session_data, callback) {
	if (session_data.user_auth != 'true') {
		return res.redirect('/login');
	} else {
		callback();
	}
};
// =>
router.get_with_session = function get_with_session (url, url_handler_callback) {
	this.get(url, function (req, res) {
		find_or_start_session(req, res, function (session_data) {
			url_handler_callback(req, res, session_data);
		});
	});
};
// =>
find_or_start_session = function find_or_start_session(req, res, session_callback) {
	browser_cookie = req.cookies;
	if (!browser_cookie.cookie_key) {
		var new_key = make_id();
		insert_new_key_to_db(new_key, function (session_obj) {
			save_new_key_to_browser(res, new_key);
			session_callback(session_obj);
		});
	} else {
		db.run_smart("SELECT session_data FROM cookie_key_json WHERE cookie_key = ?", browser_cookie.cookie_key, function (err, rows) {
		if (rows.length == 0) {
			var new_key = make_id();
			insert_new_key_to_db(new_key, function (session_obj) {
				save_new_key_to_browser(res, new_key);
				session_callback(session_obj);
		} else {
			var session_parsed = JSON.parse(rows[0].session_data);
			session_callback(session_parsed);
		}
		});
	}
};
// 3 helper functions
make_id = function make_id() {
	var text = "";
	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	for (var i = 0; i < 6; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	};
	return text;
};

insert_new_key_to_db = function insert_new_key_to_db (new_key, callback) {
	var session_obj = {user_auth = 'false'};
	var session_string = JSON.stringify(session_obj);
	db.run_smart("INSERT INTO cookie_key_json (cookie_key, session_data) VALUES (?, ?)", new_key, session_string, function (err, rows) {
		callback(session_obj);
	});

save_new_key_to_browser = function save_new_key_to_browser (res, new_key) {
	res.setHeader('Set-Cookie', cookie.serialize('cookie_key', new_key));
};
