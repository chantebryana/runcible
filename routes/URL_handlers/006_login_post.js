// moved helper functions to routes/helper_func/020_user_auth_func.js

router.post_with_session('/loginpost', function(req, res, session_data) {
	//CE PUT ENCRYPTION HERE

	const crypto = require('crypto');
	const hash = crypto.createHash('sha256');

	var genRandomString = function genRandomString(length) {
		return crypto.randomBytes(Math.ceil(length/2))
			.toString('hex')
			.slice(0,length);
	};

	var hash_pass = req.body['password'] + genRandomString(10);

	// CE notes: lines 6 thru 15 don't work: they create a random new hash instead of accessing the salt hash that's saved in the db table entry for 'hashname' and 'hashword' username and password for login. Right now current code outputs this in terminal: 

/*
index.js listening on port 3000!
pg_load:  8
57b761b1429e55642e1b4fc0748c56ce099c79a4ef32422a91bb9c1ba5f7d358
pg_load:  9
51730b2428406f456c42bae2a2a71936494b3ae5a68c8ffc47e017379ab3a7cf
pg_load:  10
ff87a8884541703eec6fe9afc3d9dfd03f16bac21ddcf46ef732b05c36e3cbd0
pg_load:  11

*/

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

