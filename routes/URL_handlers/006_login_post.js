// moved helper functions to routes/helper_func/020_user_auth_func.js

router.post('/loginpost', function(req, res) {
	cookie_var = req.cookies; // {cookie_key:"abc123"} or {}
	db.run_smart("SELECT * FROM user_acct WHERE username = \"" + req.body["username"] + "\" AND password = \"" + req.body["password"] + "\"", function(err, rows_ua) {
		db.run_smart("SELECT session_data FROM cookie_key_json WHERE cookie_key = \"" + cookie_var.cookie_key + "\"", function(err, rows_ckj) {
			if (rows_ua.length == 0) {
				//if (!cookie_var.cookie_key) { // if there's no cookie key
				if (rows_ckj.length == 0) { // if there's no db entry based on cooke_var.cookie_key
					console.log("1a");
					new_cookie_key = make_id();
					insert_new_id_to_db_table(new_cookie_key, function () {
						//save_new_cookie_id_to_browser(new_cookie_key);
						res.setHeader('Set-Cookie', cookie.serialize('cookie_key', new_cookie_key)); //CE: writing this line manually instead of calling it via save_new_cookie_id_to_browser() didn't throw an error. Huh.
						return res.redirect("/login?user_auth=false");
					});
				} else { // if an unauthorized cookie key already exists in the browser and the db table
					console.log("1b");
					return res.redirect("/login?user_auth=false");
				}
			} else { // if login was successful
				//if (!cookie_var.cookie_key) { // if there's no cookie key
				if (rows_ckj.length == 0) { // if there's no db entry based on cooke_var.cookie_key
					console.log("2a");
					new_cookie_key = make_id();
					insert_new_id_to_db_table(new_cookie_key, function () {
						//save_new_cookie_id_to_browser(new_cookie_key); // CE UPSET HERE: no browser cookie saved, but successful login
						res.setHeader('Set-Cookie', cookie.serialize('cookie_key', new_cookie_key)); //CE: writing this line manually instead of calling it via save_new_cookie_id_to_browser() didn't throw an error. Huh.
						authorize_db_session_data(new_cookie_key, function () {
							return res.redirect("/");
						});
					})
				} else { // there's already an unauthorized browser cookie key
					console.log("2b");
					authorize_db_session_data(cookie_var.cookie_key, function () {
						return res.redirect("/");
					});
				}
			}
		});
	});
});
