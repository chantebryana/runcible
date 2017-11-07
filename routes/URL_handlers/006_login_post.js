// moved helper functions to routes/helper_func/020_user_auth_func.js

router.post_with_session('/loginpost', function(req, res, session_data) {
	//cookie_var = req.cookies; // {cookie_key:"abc123", is_auth:"false"} or {} 
	//db.run_smart ("SELECT * FROM user_acct WHERE username = \"" + req.body["username"] + "\" AND password = \"" + req.body["password"] + "\"", function(err, rows_ua) {
db.run_smart ("SELECT * FROM user_acct WHERE username = ? AND password = ?", req.body["username"], req.body["password"], function(err, rows) {
		if (rows.length == 0) { // if login failed
			return res.redirect("/login?user_auth=false");
		} else { // if login successful
			browser_cookie = req.cookies;
			authorize_db_session_data(browser_cookie.cookie_key, session_data, function (session_data) {
				return res.redirect("/");
			});
		}
	});
});


