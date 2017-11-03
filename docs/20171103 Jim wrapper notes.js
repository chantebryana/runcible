//JE pseudocode wrappers or something
//(mimick api of regular router.get)

// router.get registers a callback that's a URL handler, so that when the server receives a request for the associated URL (like '/'), it calls the registered function (function(req, res){...}). 

// this makes the wrapper mimick the original w/ no other changes in performance
router.get_with_session = function get_with_session(URL, url_handler_callback) {
	this.get(URL, function (req, res) {
		url_handler_callback(req, res);
	});
}

//checks for cookie (req.cookies). if there's a cookie, check w/ db to see if it matches. if there's no match, then create a new one and save it to db and browser. if there's no cookie at all, then skip the db-check step and jump right to creating a new one and savint it to db and browser. get_with_session will be called anywhere 'get' would have been called (each URL handler file). but get_with_session only needs to be saved once (as a helper function file).
router.get_with_session = function get_with_session(URL, url_handler_callback) {
	this.get(URL, function (req, res) {
		find_or_start_session(req, res, function(session_data) { // maybe one or two db queries will run wrapped up in line 14. argument 'session_data' is the splooge that squirts out of the db queries and that gets passed forward below.
			// now we have a legit session: it may have already existed before or it may be new, but it's definitely there
			url_handler_callback(req, res, session_data);
		});
	});
};

// how to then take idea of wrapping a tier of functionality into a higher tier of func.
// 1: proper session footing; 2: make sure we're properly authenticated.
router.get_with_auth = function get_with_auth(URL, handler_callback) {
	this.get_with_session(URL, function (req, res, session_data) {
		verify_and_stay_or_redirect_to_login(res, session_data, function() {
			handler_callback(req, res, session_data);
		});
	});
};

// this is probably more or less ready to hit the road.
function verify_and_stay_or_redirect_to_login(res, session_data, callback) { // this callback is defined / has its origin in the function() on line 27 above.
	//if (session_data.user_auth == 'false') { // assuming that session_data is already JSON.parse-ed, and also assuming that I use 'user_auth' and that it's set to the strings 'true' or 'false'.
	if (session_data.user_auth != 'true') { // JE: better practice, tighter code
		return res.redirect("/login");
	} else { // if the session data is already authorized to navigate full website
		// proceed to whatever page I'm on, however I do that...
		callback(); // doesn't need arguments, it just needs to be called to //do// a thing. the arguments needed for the internal function uses variables that are already part of the available namespace.
	}
};

// -- Jimbo capturing some idle thoughts before walking away from this discussion --
// JE: keep in mind that almost all URL handlers will be registered with `router.get_with_auth()` making `router.get_with_session()` seem purely internal (i.e. might seem reasonable to embed the 'session' code in 'auth'). But there is at least one pair of URLs that will be registered with 'session' instead: '/login' and '/loginpost'. Operations triggered by '/loginpost' actually define the state used by 'auth', e.g. `session_data.user_auth == 'true'`.
// JE: all of this leaves aside the need to define and facilitate a best-practice for writing altered session-data back to the database. (Asynchronous structure prevents adding an automatic save-back at URL-handler tear-down time but a helper can be provided for use by any URL handler that alters session-data can that (tests for session-data changes and) performs the SQL `UPDATE` using the `session_data.toJSON()`.
// JE: Re - Session-by-session authenticated users -- `session_data` holds facts that apply to this login session but some URL-handlers might want access to facts that apply to a user (i.e. stored on the user's record in the db table) -- for this purpose, `/loginpost` might save a `session_data.user_id` to facilitate `SELECT` and `UPDATE` operations on the user record in other URL-handlers. (E.g. user_name: "Welcome Jane Q. Public -- Here is a summary of your cycle data:")
