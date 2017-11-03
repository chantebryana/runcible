// moved helper functions to routes/helper_func/020_user_auth_func.js

router.post('/loginpost', function(req, res) {
	cookie_var = req.cookies; // {cookie_key:"abc123"} or {}
	db.run_smart("SELECT * FROM user_acct WHERE username = \"" + req.body["username"] + "\" AND password = \"" + req.body["password"] + "\"", function(err, rows_ua) {
		db.run_smart("SELECT session_data FROM cookie_key_json WHERE cookie_key = \"" + cookie_var.cookie_key + "\"", function(err, rows_ckj) {
			//parsed_session_data = JSON.parse(rows_ckj[0].session_data); // {user_auth:"false"} or {} 
			if (rows_ua.length == 0) {
				// CE: create and save to db and browser cache unauthorized browser cookie key
				// CE: but what if I aleady have an unauthorized browser cookie key saved? I suppose I would require a second-nested if/else
				//if (!cookie_var.cookie_key) { // if there's no cookie key
				if (rows_ckj.length == 0) { // if there's no db entry based on cooke_var.cookie_key
					console.log("1a");
					// create and save one (unauthorized)
					new_cookie_key = make_id();
					insert_new_id_to_db_table(new_cookie_key, function () {
						save_new_cookie_id_to_browser(new_cookie_key);
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
					// create and save one
					// authorize it
					new_cookie_key = make_id();
					insert_new_id_to_db_table(new_cookie_key, function () {
						//save_new_cookie_id_to_browser(new_cookie_key); // CE UPSET HERE: no browser cookie saved, but successful login
/*
	terminal error message from line 32 
TypeError: res.setHeader is not a function
    at save_new_cookie_id_to_browser (/home/ruby/Projects/runcible/routes/helper_func/020_user_auth_funcs.js:19:6)
    at /home/ruby/Projects/runcible/routes/URL_handlers/006_login_post.js:32:7
... 
*/
						res.setHeader('Set-Cookie', cookie.serialize('cookie_key', new_cookie_key)); //CE: writing this line manually instead of calling it via save_new_cookie_id_to_browser() didn't throw an error. Huh.
						authorize_db_session_data(new_cookie_key, function () {
							return res.redirect("/");
						});
					})
				} else { // there's already an unauthorized browser cookie key
					// authorize it
					console.log("2b");
					authorize_db_session_data(cookie_var.cookie_key, function () {
						return res.redirect("/");
					});
				}
			}
		});
	});
});
