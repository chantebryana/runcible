// first crack at assembling function set for get_with_session
// (refer to `docs/20171103 Jim wrapper notes.js` for more info

make_id = function make_id() {
	var text = "";
	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	for (var i = 0; i < 6; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	};
	return text;
}

insert_new_key_to_db = function insert_new_key_to_db(new_key, callback) {
	var sesh_false_obj = {user_auth:"false"};
	var sesh_false_string = JSON.stringify(sesh_false_obj);
	db.run_smart("INSERT INTO cookie_key_json (cookie_key, session_data) VALUES(\"" + new_key + "\", " + sesh_false_string +  ")", function(err, rows) {
		callback(sesh_false_obj);
	});
}

/*
Let's make a note. I commented-out the preamble section of `home_pg.js`. I updated the `get` wrappers and their respective helper functions, making sure that the `session_data`-style variables were all the same format (already parsed-out, but stringified if being injected into a sqlite query). I cranked up the web server and refreshed localhost:3000/ and there was no error! I then cleared the cookies (localhost:3000/clearcookie), after which the web page froze and the terminal reported this error: 

```
{ Error: SQLITE_ERROR: near "user_auth": syntax error
    at Error (native) errno: 1, code: 'SQLITE_ERROR' }
```

I want to emphasize that my new code didn't crash right away if there was already a functioning cookie. That suggests that it's stable enough to pass forward already authorized variables: cool! There are still kinks to iron out if I have to explore any of the branches (ie, if my session isn't authorized), which, granted, encapsulates lots of workflow possibilities. But It's pretty rad that my new code didn't automatically explode everything like I was expecting. ;-)

Re my sqlite error: I'm going to play around with quotes. But if that doesn't work then I'm not sure what to do about it -- it's a remarkably unspecific error!

OK, so I updated my sqlite query to include a closing parenthases (need this to work). This update provided the same sqlite error message, so I tried removing the escaped quotes around the `session_data_string`-style variable. This gave me a different error: 

```
{ Error: SQLITE_ERROR: unrecognized token: "{"
    at Error (native) errno: 1, code: 'SQLITE_ERROR' }
```

While I still don't really know what's going on with these sqlite errors, I have some reason to believe that the error revolves around the `INSERT` query that I've been focusing on. It suggests that I'm looking at the right portion of code! I'm still confused, but it is likely an educated confused. ;-)
*/

save_new_key_to_browser = function save_new_key_to_browser(res, new_key){
	res.setHeader('Set-Cookie', cookie.serialize('cookie_key', new_key));
}

//
//
//
//
find_or_start_session = function find_or_start_session(req, res, session_callback) {
	browser_cookie = req.cookies;
	if (!browser_cookie.cookie_key) { // if there is no `browser_cookie`
		// make and save an unauthorized one
		var new_key = make_id();
		insert_new_key_to_db(new_key, function(sesh_false_obj) {
			save_new_key_to_browser(res, new_key);
			session_callback(sesh_false_obj);
		});
	} else { // if there is a browser cookie
		// check it against the database
		db.run_smart("SELECT session_data FROM cookie_key_json WHERE cookie_key = \"" + browser_cookie.cookie_key + "\"", function(err, rows) {
			if (rows.length == 0) { // if it's invalid, make and save a new unauthorized one (?) -- ask Jim maybe
				var new_key = make_id();
				insert_new_key_to_db(new_key, function(sesh_false_obj) {
					save_new_key_to_browser(res, new_key);
					session_callback(sesh_false_obj);
				});
			} else { // if the `browser_cookie` matches a record in the db table
				var sesh_parsed = JSON.parse(rows[0].session_data);
				session_callback(sesh_parsed);
			}
		}); 
	}
};


router.get_with_session = function get_with_session(url, url_handler_callback) {
	this.get(url, function (req, res) {
		find_or_start_session(req, res, function (session_data) {
			url_handler_callback(req, res, session_data);
		});
	});
};

// first crack at assembling function set for get_with_auth
// (refer to `docs/20171103 Jim wrapper notes.js` for more info

function stay_or_redirect(res, session_data, callback) {
	if (session_data.user_auth != 'true') {
		return res.redirect("/login");
	} else {
		callback();
	}
};

router.get_with_auth = function get_with_auth(url, handler_callback) {
	this.get_with_session(url, function (req, res, session_data) {
		stay_or_redirect(res, session_data, function () {
			handler_callback(req, res, session_data);
		});
	});
};
