//router.post_pg_load('/loginpost', function(req, res, pg_load) {
router.post('/loginpost', function(req, res) {
	//console.log('Total Page Loads After Posting Login Form Page: ', pg_load);
	// query against user_acct table
	// check if true or false
	// pass forward true or false results to dummy page for now so I don't have to manipulate home page.
	db.run_smart("SELECT * FROM user_acct WHERE username = \"" + req.body["username"] + "\" AND password = \"" + req.body["password"] + "\"", function (err, rows) {
		var user_auth;
		if (rows.length == 0) {
			user_auth = false;
		} else {
			user_auth = true;
		};
		//res.redirect('/login?user_auth=' + user_auth);
		res.redirect('logged_in?user_auth=' + user_auth);
		// i could pass data forward w/ res.redirect and a query string that passes user_auth variable.
	});
});
