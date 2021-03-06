// helper functions for wrappers `get_with_session` and `post_with_session`:

// make and return a 6-character case-sensitive-alpha-numeric string (new cookie key): 
make_id = function make_id() {
	//console.log("make_id() is running!");
	var text = "";
	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	for (var i = 0; i < 24; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	};
	return text;
}

// insert new key and session data entry into db table. pass session_data variable forward via callback: 
insert_new_key_to_db = function insert_new_key_to_db(new_key, callback) {
	//console.log("insert_new_key_to_db() is running!");
	var session_obj = {user_auth:"false"};
	var session_string = JSON.stringify(session_obj);
	db.run_smart("INSERT INTO cookie_key_json (cookie_key, session_data) VALUES(?, ?)", new_key, session_string, function(err, rows) {
		callback(session_obj);
	});
}

// save new key to browser's cookie cache: 
save_new_key_to_browser = function save_new_key_to_browser(res, new_key){
	//console.log("save_new_key_to_browser() is running!");
	res.setHeader('Set-Cookie', cookie.serialize('cookie_key', new_key));
}

// saves any changes to `session_data` back to db at end of URL handler's workflow. will be called as part of `res.render` or `res.redirect`. empty `save_callback` just allows workflow to move forward as part of asynchronous flow.
save_session = function save_session(session_data, res, browser_key, save_callback) {
	var browser_key = browser_cookie;
	var session_string = JSON.stringify(session_data);
	console.log("pg_load: ", session_data.pg_load);
	db.run_smart("UPDATE cookie_key_json SET session_data = ? WHERE cookie_key = ?", session_string, browser_key.cookie_key, function (err, rows) {
		save_callback();
		});
};

//add session handling functionality to the `res` object. this function is needed to make `res.render_with_session` work within URL handlers. `ashtro` will be called within `find_or_start_session` below.
add_session_handling_to_res_obj = function add_session_handling_to_res_obj(res) {
	res.render_with_session = function render_with_session(session_data, browser_key, view, locals) {
		//save_session(session_data, this, browser_key, function() {
		save_session(session_data, res, browser_key, function() {
			//this.render(view, locals);
			res.render(view, locals);
		});
	};

	res.redirect_with_session = function redirect_with_session (session_data, browser_key, path) {
		save_session(session_data, res, browser_key, function () {
			res.redirect(path);
		});
	};
};

// Somehow make sure that there's a cookie key that matches between the browser and the database table. Create one if it needs to be created. Either way, pass the session_data forward via callbacks. 
find_or_start_session = function find_or_start_session(req, res, session_callback) {
	// these next two functions enable me to use `res.redirect_with_session` or `res.render_with_session` within URL handler functions:
	add_session_handling_to_res_obj(res);
	//console.log("find_or_start_session() is running!");
	browser_cookie = req.cookies;
	if (!browser_cookie.cookie_key) { // if there is no `browser_cookie`
		//console.log("foss() -> if there's no browser_key");
		// make and save an unauthorized one
		var new_key = make_id();
		insert_new_key_to_db(new_key, function(session_obj) {
			save_new_key_to_browser(res, new_key);
			session_callback(session_obj);
		});
	} else { // if there is a browser cookie
		// check it against the database
		db.run_smart("SELECT session_data FROM cookie_key_json WHERE cookie_key = ?", browser_cookie.cookie_key, function(err, rows) {
			if (rows.length == 0) { // if query results are invalid, make and save a new unauthorized one 
				//console.log("foss() -> if there is a browser_key but if it doesn't match db");
				var new_key = make_id();
				insert_new_key_to_db(new_key, function(session_obj) {
					save_new_key_to_browser(res, new_key);
					session_callback(session_obj);
				});
			} else { // if the `browser_cookie` matches a record in the db table
				//console.log("foss() -> if there is a browser_key and if it does match db");
				var session_parsed = JSON.parse(rows[0].session_data);
				session_callback(session_parsed);
			}
		}); 
	}
};

//increments page load count by 1:
increment_pg_load = function increment_pg_load(session_data, increment_callback) {
	if (!session_data.pg_load) { // if pg_load key doesn't exist, create it and set its value to 1. call `increment_callback` to move things forward w/ asynchronous flow (no need to pass updated `session_data` b/c that pointer value automatically gets updated)
		session_data.pg_load = 1;
		increment_callback();
	} else {	// if pg_load key already exists, increment its value by 1 and call `increment_callback` to move things along
		session_data.pg_load += 1;
		increment_callback();
	}
};

//
//
//
//
// helper functions for wrappers `get_with_auth` and `post_with_auth`:

// redirects to login page if session_data isn't authorized, else it passes namespace arguments (res, req, session_data) forward:
stay_or_redirect = function stay_or_redirect(res, session_data, callback) {
	if (session_data.user_auth != 'true') {
		//console.log("stay_or_redirect() -> unauthorized session data");
		return res.redirect("/login");
	} else {
		//console.log("stay_or_redirect() -> authorized session data");
		callback();
	}
};
