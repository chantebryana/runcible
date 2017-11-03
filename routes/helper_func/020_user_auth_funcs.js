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
	db.run_smart("INSERT INTO cookie_key_json (cookie_key, session_data) VALUES(\"" + new_cookie_key + "\", '{\"user_auth\": \"false\"}')", function(err, rows) {
		callback();
	});
}

save_new_cookie_id_to_browser = function save_new_cookie_id_to_browser(res, new_cookie_key){
	res.setHeader('Set-Cookie', cookie.serialize('cookie_key', new_cookie_key));
}

authorize_db_session_data = function authorize_db_session_data(cookie_key, callback) {
	db.run_smart("UPDATE cookie_key_json SET session_data = '{\"user_auth\": \"true\"}' WHERE cookie_key = \"" + cookie_key + "\"", function(err, rows) {
		callback();
	});
};

/*
///temptemptemp
db.run_smart("SELECT session_data FROM cookie_key_json WHERE cookie_key = \"" + cookie_var.cookie_key + "\"", function(err, rows) {
	if (rows.length == 0) {
		return res.redirect("/login");
	} else {
		var parsed_session_data = JSON.parse(rows[0].session_data);
		if (parsed_session_data.user_auth == 'false') {
			// CE/JE: here I could set a cookie (instead of passing forward query string) OR I could just set the unauthorized browser cookie key HERE and have it set already. --> uh, no I can't authorize the key here, because I haven't passed the login test. So I'd have to set a cookie instead.
			return res.redirect("/login");
		}

////temptemptemptemp login_post.js
//router.post_pg_load('/loginpost', function(req, res, pg_load) {
router.post('/loginpost', function(req, res) {
	cookie_var = req.cookies;
	console.log(cookie_var.cookie_key);
	db.run_smart("SELECT * FROM user_acct WHERE username = \"" + req.body["username"] + "\" AND password = \"" + req.body["password"] + "\"", function (err, rows) {
		if (rows.length == 0) {
			// CE: if no browser session, then create one and set user_auth to false. no need for an 'else' condition, b/c if there //is// a browser session then to get to this branch (based on logic in home_pg.js) it's already set to false.
			db.run_smart("SELECT session_data FROM cookie_key_json WHERE cookie_key = \"" + cookie_var.cookie_key + "\"", function (err, rows) {
				var parsed_session_data = JSON.parse(rows[0].session_data);
				if (parsed_session_data.user_auth == 'false') {
					return res.redirect("/login?user_auth=false");
				}
			});
			return res.redirect("/login?user_auth=false");
		} else {
			// for now I'll just presume that I don't have a unauthorized browser session: no nested if/else
			var new_cookie_key = make_id();
			insert_new_id_to_db_table(new_cookie_key, function() {
				save_new_cookie_id_to_browser(res, new_cookie_key);
				res.redirect('/');
			});
		}
	});
});
*/

