// helper functions for user authentication protocol

make_id = function make_id() {
	var text = "";
	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	for (var i = 0; i < 6; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	};
	return text;
}

insert_new_id_to_db_table = function insert_new_id_to_db_table(new_cookie_key, callback) {
	db.run_smart("INSERT INTO cookie_key_json (cookie_key, session_data) VALUES(\"" + new_cookie_key + "\", '{\"user_auth\": \"true\"}')", function(err, rows) {
		callback();
	});
}

save_new_cookie_id_to_browser = function save_new_cookie_id_to_browser(res, new_cookie_key){
	res.setHeader('Set-Cookie', cookie.serialize('cookie_key', new_cookie_key));
}
