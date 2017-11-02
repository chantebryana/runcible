function make_id() {
	var text = "";
	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	for (var i = 0; i < 6; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	};
	return text;
}

function insert_new_id_to_db_table(new_cookie_key, callback) {
	db.run_smart("INSERT INTO cookie_key_json (cookie_key, session_data) VALUES(\"" + new_cookie_key + "\", '{\"user_auth\": \"true\"}')", function(err, rows) {
		callback();
	});
}

function save_new_cookie_id_to_browser(res, new_cookie_key){
	res.setHeader('Set-Cookie', cookie.serialize('cookie_key', new_cookie_key));
}

//router.post_pg_load('/loginpost', function(req, res, pg_load) {
router.post('/loginpost', function(req, res) {
	cookie_var = req.cookies;
	console.log(cookie_var.cookie_key);
	db.run_smart("SELECT * FROM user_acct WHERE username = \"" + req.body["username"] + "\" AND password = \"" + req.body["password"] + "\"", function (err, rows) {
		if (rows.length == 0) {
			return res.redirect("/login?user_auth=false");
		} else {
			// for now I'll just presume that I don't have a unauthorized browser session: no nested if/else
			var new_cookie_key = make_id();
			insert_new_id_to_db_table(new_cookie_key, function() {
				save_new_cookie_id_to_browser(res, new_cookie_key);
				res.redirect('/');
			});
			//db.run_smart("INSERT INTO cookie_key_json (cookie_key, session_data) VALUES(\"" + new_cookie_key + "\", '{\"user_auth\": \"true\"}')", function(err, rows) {

				//res.setHeader('Set-Cookie', cookie.serialize('cookie_key', new_cookie_key)); 
				//res.redirect('/');
			//});
		}
	});
});


