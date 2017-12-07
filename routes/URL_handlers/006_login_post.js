// moved helper functions to routes/helper_func/020_user_auth_func.js

router.post_with_session('/loginpost', function(req, res, session_data) {
	//CE PUT ENCRYPTION HERE

	// db access for salt!
	//findNameGetSalt(req.body.username, function(salt) {
	salty(req.body, function(hash_pass) {
	//var hash_pass = req.body['password'] + salt;


//	sha256Sum(req.body["password"], function(hex_hash) {
		sha256Sum(hash_pass, function(hex_hash) {
		console.log(hex_hash);
		db.run_smart ("SELECT * FROM user_acct WHERE username = ? AND password = ?", req.body["username"], hex_hash, function(err, rows) {
			if (rows.length == 0) { // if login failed
				return res.redirect("/login?user_auth=false");
			} else { // if login successful
				browser_cookie = req.cookies;
				authorize_db_session_data(browser_cookie.cookie_key, session_data, function () {
					//return res.redirect("/");
					return res.redirect_with_session(session_data, req.cookie, "/");
				});
			}
		});
	});
	});
});

