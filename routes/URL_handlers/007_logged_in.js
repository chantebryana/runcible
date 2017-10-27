router.get_pg_load('/logged_in', function(req, res, pg_load) {
	console.log('Total Page Loads After Loading Login Page: ', pg_load); // not needed for future workflow, but maintaining it for now just because
	var is_logged_in = "[[not yet attempted]]";
	if (req.query.user_auth) {
		is_logged_in = req.query.user_auth;
	}
	create_and_save_session_data(res, is_logged_in, function(new_cookie_key) {
		callback(new_cookie_key);
	});

	res.render('pages/logged_in.ejs', {
		title: 'Logged In',
		is_logged_in_to_renderer: is_logged_in, 
		cookie_key_to_renderer: new_cookie_key // this is where the terminal's upset
	});
});

/*
debugging some flaws. Here's the current terminal report for line 14 above: 

ruby@rubyVM:~/Projects/runcible$ node routes/index.js 
index.js listening on port 3000!
Total Page Loads After Loading Login Page:  258
Total Page Loads After Posting Login Form Page:  259
Total Page Loads After Loading Login Page:  260
make_id() return value:  uhwwkJ
/home/ruby/Projects/runcible/node_modules/sqlite3/lib/trace.js:27
                    throw err;
                    ^

ReferenceError: new_cookie_key is not defined
    at /home/ruby/Projects/runcible/routes/URL_handlers/007_logged_in.js:14:27
    at /home/ruby/Projects/runcible/routes/helper_func/030_get_pg_load.js:6:5
    at /home/ruby/Projects/runcible/routes/helper_func/020_cookie_pg_load_helpers.js:72:4
    at Statement.<anonymous> (/home/ruby/Projects/runcible/routes/helper_func/010_run_smart.js:7:6)
--> in Database#all('UPDATE cookie_key_json SET session_data = \'{"page_count":260}\' WHERE cookie_key = "dBj6Xp"', [Function])
    at Database.run_smart (/home/ruby/Projects/runcible/routes/helper_func/010_run_smart.js:3:8)
    at /home/ruby/Projects/runcible/routes/helper_func/020_cookie_pg_load_helpers.js:70:6
    at Statement.<anonymous> (/home/ruby/Projects/runcible/routes/helper_func/010_run_smart.js:7:6)

*/
