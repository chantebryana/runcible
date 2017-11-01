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
		// CE: this req.query.key outputs the following query string after being redirected back to the login page: 
		// http://localhost:3000/login?key=undefined&user_auth=true
		//res.redirect('/login?key=' + req.query.key + '&user_auth=' + user_auth);
		res.redirect('/login?key=' + key_to_renderer + '&user_auth=' + user_auth);
		//res.redirect('logged_in?user_auth=' + user_auth);
		// i could pass data forward w/ res.redirect and a query string that passes user_auth variable.
	});
});

/*
trying to fix 'key' value query string funkiness (after formpost 'key' is getting redefined from 'null' to 'undefined'). The above change (line 17) gave me this error (server crashed at localhost:3000/loginpost):

ruby@rubyVM:~/Projects/runcible$ node routes/index.js 
index.js listening on port 3000!
Cookies from browser:  {}
cookie_var:  {}
/home/ruby/Projects/runcible/node_modules/sqlite3/lib/trace.js:27
                    throw err;
                    ^

ReferenceError: key_to_renderer is not defined
    at /home/ruby/Projects/runcible/routes/URL_handlers/006_login_post.js:17:32
    at Statement.<anonymous> (/home/ruby/Projects/runcible/routes/helper_func/010_run_smart.js:7:6)
--> in Database#all('SELECT * FROM user_acct WHERE username = "named_user" AND password = "pass0word!"', [Function])
    at Database.run_smart (/home/ruby/Projects/runcible/routes/helper_func/010_run_smart.js:3:8)
    at /home/ruby/Projects/runcible/routes/URL_handlers/006_login_post.js:7:5
    at Layer.handle [as handle_request] (/home/ruby/Projects/runcible/node_modules/express/lib/router/layer.js:95:5)
    at next (/home/ruby/Projects/runcible/node_modules/express/lib/router/route.js:137:13)
    at Route.dispatch (/home/ruby/Projects/runcible/node_modules/express/lib/router/route.js:112:3)
    at Layer.handle [as handle_request] (/home/ruby/Projects/runcible/node_modules/express/lib/router/layer.js:95:5)
    at /home/ruby/Projects/runcible/node_modules/express/lib/router/index.js:281:22
    at Function.process_params (/home/ruby/Projects/runcible/node_modules/express/lib/router/index.js:335:12)
    at next (/home/ruby/Projects/runcible/node_modules/express/lib/router/index.js:275:10)

*/
