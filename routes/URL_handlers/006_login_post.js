//router.post_pg_load('/loginpost', function(req, res, pg_load) {
router.post('/loginpost', function(req, res) {
	//console.log('Total Page Loads After Posting Login Form Page: ', pg_load);
	// query against user_acct table
	// check if true or false
	// pass forward true or false results to dummy page for now so I don't have to manipulate home page.
	cookie_var = req.cookies;
	//cookie_var = {"cookie_key":"abc123"}
	console.log(cookie_var.cookie_key);
	db.run_smart("SELECT * FROM user_acct WHERE username = \"" + req.body["username"] + "\" AND password = \"" + req.body["password"] + "\"", function (err, rows) {
		var user_auth;
		if (rows.length == 0) {
			user_auth = false;
		} else {
			user_auth = true;
		};
		// CE: this req.query.key outputs the following query string after being redirected back to the login page: 
		// http://localhost:3000/login?key=undefined&user_auth=true
		//res.redirect('/login?key=' + req.query.key + '&user_auth=' + user_auth);
		res.redirect('/login?key=' + cookie_var.cookie_key + '&user_auth=' + user_auth);
		//res.redirect('/login?key=' + req.body["key"] + '&user_auth=' + user_auth);
		//res.redirect('logged_in?user_auth=' + user_auth);
		// i could pass data forward w/ res.redirect and a query string that passes user_auth variable.
	});
});


