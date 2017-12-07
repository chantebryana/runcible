// helper functions for user authentication protocol in login_post.js

// if a user logs in correctly, their unauthorized session becomes authorized (by setting user_auth to true): 
authorize_db_session_data = function authorize_db_session_data(cookie_key, session_data, callback) {
	session_data.user_auth = "true"; // JE: pointer to user_auth variable within session_data object is manipulated -- a new copy of session_data isn't created over top the old one. long story short, I'll have access to the updated session_data elswhere in my code b/c of pointers -- I don't need to manually pass forward what I've changed here. This also means I don't have to include any arguments within the callback on line 8.
	session_string = JSON.stringify(session_data);
	db.run_smart("UPDATE cookie_key_json SET session_data = ? WHERE cookie_key = ?", session_string, cookie_key, function(err, rows) {
		callback();
	});
};

// `body` includes user-entered username and password from login page. this function looks up username in `user_acct` db table and returns associated `salt` to `rows` variable; it then assigns variable `hash_pass` to user-entered password plus the `salt` looked up by db query. Passes `hash_pass` forward via callback, which will be used more in `sha256Sum`:
salty = function salty(body, callback) {
	db.run_smart("SELECT salt FROM user_acct WHERE username = ?", body.username, function(err, rows) {
		if (rows.length > 0) { // if db query works as expected, ie, if length is greater than 0
			var hash_pass = body.password + rows[0].salt;
			callback(hash_pass);
		} else { // if `body.username` is blank/doesn't match db values, and `rows` is empty (fill `hash_pass` with dummy values that won't break future functions)
			var hash_pass = body.password;
			callback(hash_pass);
		}
	});
};

// take `hash_pass` (from callback of `salty`) and convert it over to a sha-256 hexidecimal hash. Will later be used in `login_post` page to determine whether login attempt can be authenticated or not (ie, whether it was successful or not):  
sha256Sum = function sha256Sum(data, callback){
	const crypto = require("crypto");
	const hash = crypto.createHash("sha256");
	hash.on("readable", function() {
		const data = hash.read();
		if (data) {
			var hex_hash = data.toString("hex");
			callback(hex_hash);
		}
	});
	hash.write(data);
	hash.end();
};

// combine salt with sha-256 encryption to create a single, wrapped up box with a single clean and sleek and fully-functioning function to use in `login_post`: 
//take user-entered username and password (`body`), combine it with the salt (db lookup), encrypt salted password, and pass forward via callback: 
passwordCheck = function passwordCheck(body, callback) {
	salty(body, function(hash_pass) {
		sha256Sum(hash_pass, function(hex_hash) {
			callback(hex_hash);
		});
	});
};

