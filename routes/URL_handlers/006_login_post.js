// moved helper functions to routes/helper_func/020_user_auth_func.js
/*
// db-query-based workflow:
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
*/

// cookie-based workflow:
router.post('/loginpost', function(req, res) {
	cookie_var = req.cookies; // {cookie_key:"abc123", is_auth:"false"} or {} 
	db.run_smart ("SELECT * FROM user_acct WHERE username = \"" + req.body["username"] + "\" AND password = \"" + req.body["password"] + "\"", function(err, rows_ua) {
		if (rows_ua.length == 0) { // if login failed
			if (!cookie_var.cookie_key) { // if there's no cookie
				console.log("1a");
				new_cookie_key = make_id();
				insert_new_id_to_db_table(new_cookie_key, function () {
					//save_new_cookie_id_to_browser(new_cookie_key);
					res.setHeader('Set-Cookie', cookie.serialize('cookie_key', new_cookie_key)); //CE: writing this line manually instead of calling it via save_new_cookie_id_to_browser() didn't throw an error. Huh.
					return res.redirect("/login?user_auth=false");
				});
			} else { // if there's an unauthorized cookie, ie, if cookie_var.is_auth == 'false'
				console.log("1b");
				return res.redirect("/login?user_auth=false");
			}
		} else { // if login successful
			if (!cookie_var.cookie_key) { // if there's no cookie
				console.log("2a");
				new_cookie_key = make_id();
				insert_new_id_to_db_table(new_cookie_key, function () {
					//save_new_cookie_id_to_browser(new_cookie_key); // CE UPSET HERE: no browser cookie saved, but successful login
					res.setHeader('Set-Cookie', cookie.serialize('cookie_key', new_cookie_key)); //CE: writing this line manually instead of calling it via save_new_cookie_id_to_browser() didn't throw an error. Huh.
					authorize_db_session_data(new_cookie_key, function () {
						return res.redirect("/");
					});
				})
			} else { // if there's an unauthorized cookie, ie, if cookie_var.is_auth == 'false'
				console.log("2b");
				authorize_db_session_data(cookie_var.cookie_key, function () {
					return res.redirect("/");
				});
			}
		}
	});
});

/*
	workflow followed: 
		- clear cookie
		- type home page into address bar
		- get auto-redirected to login page
		- try to login with an invalid login
		- get auto-redirected back to login

	terminal printout: 
ruby@rubyVM:~/Projects/runcible$ node routes/index.js 
010_run_smart.js
020_user_auth_funcs.js
050_id_date_range_helpers.js
060_x-y_axis_helpers.js
index.js listening on port 3000!
Cookies from browser:  {}
cookie_var:  {}
2a
Cookies from browser:  { cookie_key: '6LooWk' }
cookie_var:  { cookie_key: '6LooWk' }
Cookies from browser:  { is_auth: 'true' }
cookie_var:  { is_auth: 'true' }
1a

Question: why is 'is_auth_ set to true? How could that even happen?? 
I figured it out: I had set it to 'true' in a previous login. I then cleared the cookie (as itemized by the first step), BUT the clear cookie brains didn't include clearing the 'is_auth' cookie, just the 'cookie_key' cookie. I fixed 'clearcookie' file and now it all works as expected! Yay!

Also, all of the workflows seem to work within the cookie-based lookup. 
*/
