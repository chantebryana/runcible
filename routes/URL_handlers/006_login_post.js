function make_id() {
	var text = "";
	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	for (var i = 0; i < 6; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	};
	return text;
}

function save_new_cookie_id_to_browser(res, new_cookie_key){
	res.setHeader('Set-Cookie', cookie.serialize('cookie_key', new_cookie_key));
}
/*
function insert_new_id_to_db_table(new_cookie_key, callback) {
	db.run_smart("", function (err, rows) {

	});
}
*/

//router.post_pg_load('/loginpost', function(req, res, pg_load) {
router.post('/loginpost', function(req, res) {
	//console.log('Total Page Loads After Posting Login Form Page: ', pg_load);
	// query against user_acct table
	// check if true or false
	// pass forward true or false results to dummy page for now so I don't have to manipulate home page.
	cookie_var = req.cookies;
	console.log(cookie_var.cookie_key);
	db.run_smart("SELECT * FROM user_acct WHERE username = \"" + req.body["username"] + "\" AND password = \"" + req.body["password"] + "\"", function (err, rows) {
		if (rows.length == 0) {
			//console.log("FILE: login_post CURRENT BRANCH: if(rows.length==0)");
			return res.redirect("/login?user_auth=false");
		} else {
			// for now I'll just presume that I don't have a unauthorized browser session: no nested if/else
			//console.log("FILE: login_post CURRENT BRANCH: else //(if login credentials successfully queried db table)");
			var new_cookie_key = make_id();
			//console.log("FILE: login_post BRANCH: else COOKIE_KEY: ", cookie_key); // CE: returns expected 6-char alpha-numeric value
			//save_new_cookie_id_to_browser(res, cookie_key);
			res.setHeader('Set-Cookie', cookie.serialize('cookie_key', new_cookie_key));
			console.log("FILE: login_post BRANCH: else STATEMENT: ", req.cookies.cookie_key);
		}
	});
});

/*
// CE: playing with pseudocode on how to make various workflow conditions more robust
if rows.length == 0 
	res.redirect to login page // later make an unauthorized session data log, but for now just redirect
else 
	if no cookie_var // how to check for that condition?
		make one
		save it to db, browser
	set user_auth to true
	res.redirect to desired cycle of home page
*/

/*
//old code from within db.run_smart()

		var user_auth;
		if (rows.length == 0) {
			user_auth = false;
		} else {
			user_auth = true;
		};
		res.redirect('/login?user_auth=' + user_auth);
*/
