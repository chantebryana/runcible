router.post_pg_load('/loginpost', function(req, res, pg_load){
	console.log('Total Page Loads After Posting Login Page: ', pg_load);
	/*
	somehow have access to the following data: 
		browser_cookie_key: whether it's set to 'true' or 'false'
		user_auth: whether it's set to 'true' or 'false'
	query user_acct db table to see if login info matches

	
	*/
	// db queries: check session data db table to see if there are browser_cookie_key and/or user_auth records; assign them to variables and/or set variables to false or to some other marker that shows that there is or isn't current data for those variables

	db.run_smart("SELECT * FROM user_acct WHERE username = \"" + req.body["username"] + "\"", function(err, rows_acct){

	if (rows_acct.length == 0) { // if there's no match
		// the login attempt failed
		// create a new session data for this browser, but set user_auth field to false (this step will require db table lookups and other helper functions to create and save this session. Some of that workflow is repeated within the else branch below.)
		// res.redirect back to login page
	} else { // if the db query returns some data
		// get browser_cookie_key from the browser using adapted version of check_browser_cookie() (020_cookie_pg_load_helpers.js)
		var browser_cookie_key = req.cookies; // swiped directly from check_browser_cookie()
		// lookup browser session table against data in user_acct table
		db.run_smart("SELECT session_data FROM cookie_key_json WHERE cookie_key = \"" + browser_cookie_key.cookie_key + "\"", function(err, rows_session) {
			if (rows_session.length == 0) { // if there's no match
				// I want to create a new session data for this browser, and set user_auth field to true
			} else { // if db table query returns some results, ie, if there's a match
				// I want to set user_auth to true (there's already a previously unauthorized logged session data for this browser, so no need to create a new one)
			}
		});
	}

	}); // this'll actually encompass the if/else branches below, but I'm separating them out for simplicity at the moment

	// decision tree, pseudocode: 
	if (user_auth_match == true) {
		if (browser_cookie_key == false) { // ie, if there's no active browser session, then create one and set user_auth to true
			browser_cookie_key = true; // maybe this'll call a function that creates a new browser key
			user_auth = true; // maybe this'll call a function that sets user_auth to true
		} else { // if (browser_cookie_key == true), ie, there's already a non-authenticated browser session, then make sure to set user_auth to true
			user_auth = true;
	} else { // if (user_auth_match == false) {
		if (browser_cookie_key == false) {
			browser_cookie_key = true;
			user_auth = false; // this explicit step may not be needed, probably user_auth is already false
		} else { // if (browser_cookie_key == true)
			user_auth = false; // this explicit step may not be needed, probably user_auth is already false
	}
})
