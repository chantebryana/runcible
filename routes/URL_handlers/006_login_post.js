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
			return res.redirect("/login");
		} else {
			// for now I'll just presume that I don't have a unauthorized browser session: no nested if/else
			console.log("FILE: login_post CURRENT BRANCH: else //(if login credentials successfully queried db table)");
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
