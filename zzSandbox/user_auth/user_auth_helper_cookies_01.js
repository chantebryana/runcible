// I've already ran check_browser_cookie() in an earlier stage of events (before switching over to login page). So remove that function from the box.
// I already know that (for simplicity / a starting point) that there is no browser session or browser cookie, but that I did log in successfully. So what next? 

function make_id() {
	var text = "";
	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

	for (var i = 0; i < 6; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	};
	console.log("make_id() return value: ", text);
	return text;
}

function insert_new_id_and_user_auth_to_db_table(new_cookie_key, user_auth, callback) {
	db.run_smart("INSERT INTO ce_session_data (cookie_key, session_data) VALUES (\"" + new_cookie_key + "\", '{\"user_auth\":\"" + user_auth + "\"}')", function(err, rows) {
		console.log("insert_new_id_and_user_auth_to_db_table() ran!");
		callback();
	});
}

function save_new_cookie_id_to_browser(res, new_cookie_key) {
	res.setHeader('Set-Cookie', cookie.serialize('cookie_key', new_cookie_key));
	console.log("save_new_cookie_id_to_browser() ran!");
}

function create_and_save_session_data(res, user_auth, callback) {
	var secret_cookie_id = make_id();
	insert_new_id_and_user_auth_to_db_table(secret_cookie_id, user_auth, function() {
		save_new_cookie_id_to_browser(res, secret_cookie_id);
		callback(secret_cookie_idh);
	});
}


