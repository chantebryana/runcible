// moved helper functions to routes/helper_func/020_user_auth_func.js

router.post_with_session('/loginpost', function(req, res, session_data) {
	//CE PUT ENCRYPTION HERE
	// sources: https://nodejs.org/api/crypto.html#crypto_class_hash
	// http://lollyrock.com/articles/nodejs-sha512/
	crypto = require("crypto");
	hash = crypto.createHash("sha256");
	hash.on("readable", function() {
		data = hash.read();
		if (data) {
			console.log(data.toString("hex"));
			// returns b193d7700a33a8fa3ed2ebb0c5de344fcba26ecf5c51e433d7d1ac5fbfb7ffec

		}
	});
	hash.write(req.body["password"]);
	hash.end();
	db.run_smart ("SELECT * FROM user_acct WHERE username = ? AND password = ?", req.body["username"], req.body["password"], function(err, rows) {
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

