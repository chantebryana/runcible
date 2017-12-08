//JE pseudocode wrappers or something
//(mimick api of regular router.get)

// router.get registers a callback that's a URL handler, so that when the server receives a request for the associated URL (like '/'), it calls the registered function (function(req, res){...}). 

// this makes the wrapper mimick the original w/ no other changes in performance
router.get_with_session = function get_with_session(URL, url_handler_callback) {
	this.get(URL, function (req, res) {
		url_handler_callback(req, res);
	});
}

//checks for cookie (req.cookies). if there's a cookie, check w/ db to see if it matches. if there's no match, then create a new one and save it to db and browser. if there's no cookie at all, then skip the db-check step and jump right to creating a new one and saving it to db and browser. get_with_session will be called anywhere 'get' would have been called (each URL handler file). but get_with_session only needs to be saved once (as a helper function file).
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
// JE: all of this leaves aside the need to define and facilitate a best-practice for writing altered session-data back to the database. (Asynchronous structure prevents adding an automatic save-back at URL-handler tear-down time but a helper can be provided for use by any URL handler that alters session-data that (tests for session-data changes and) performs the SQL `UPDATE` using the `session_data.toJSON()`.
// JE: Re - Session-by-session authenticated users -- `session_data` holds facts that apply to this login session but some URL-handlers might want access to facts that apply to a user (i.e. stored on the user's record in the db table) -- for this purpose, `/loginpost` might save a `session_data.user_id` to facilitate `SELECT` and `UPDATE` operations on the user record in other URL-handlers. (E.g. user_name: "Welcome Jane Q. Public -- Here is a summary of your cycle data:")



// 20171107 CE TRANSCRIBE THOUGHTS W/ JE; SD == SESSION_DATA:
// res.render or res.redirect or other res event that communicates back to server -- bury 'save' function within those events? also imagine saving session_data object there to get out of explicit API of any of the parts (render events, router registration calls (post, get)...) add res.session_data()? kind of doesn't belong there -- not about the result i'm returning to browser. but a place i could put it to be available at moment of render to save back to db. sd belongs more in req than res, but it's all about streamlining and getting details out of the way without making mistakes later. if i put sd in req, i'd still have to modify api of res.render, etc events -- but if sd is contained within res.render's dictionary, then it's just available and I can pass it forward. (from a lifecycle perspective sd belongs in res, from data association perspective it belongs in req)
// router.get and .post that have been overwritten to automatically handle session and authorization (so that name looks like old name) -- name of router.get/post
// end up with res.render, res.redirect overwritten to clean up mess i made 
// all the machinery's hidden in overwriting that i did. if i need to access sd i might say 'res.session_data'. if that's confusing i could make it so that both req and res have 'pointers' to sd. 
// without these behind the scenes hacks, i'd have to add a line in front of each res.render or res.redirect line that would be sure to update sd to db. 

// hide sd in 'res' object -- have the freedom to take it out of explicit API of `get` and `post` operations. [CE: like this: router.get_with_auth('/', function(req, res, session_data) {...}); ]
// note: anywhere that i'm using session_data explicity (in the url handler's code), I could say `res.session_data`, because sd is living within the `res` object. 


// for now, make an explicit function call before res.render so that i can see the incremental changes before hiding everything behind the scenes
// make a global function that will take a cookie session key and session data object and save it back to db with update. as it's more sophisticated -- first move only performing the update if the session data has actually changed. (find a way to remember what it was or record changes when they happen --> pry by remembering the JSON that came out of the db; compare it to the new JSON that we're putting in the db; if they're the same (if a == b), then no need to run query. That requires saving JSON somewhere, which is at least one more step more complicated than taking sd and saving it back. 

/*
--------------------------------------------
*/
// 2017-11-15 Added Notes re `render` wrapper (w/ Jim)


save_session_data = function save_session_data(session_data, res, browser_key, save_callback) {
	var browser_key = browser_cookie;
	var session_string = JSON.stringify(session_data);
	db.run_smart("UPDATE cookie_key_json SET session_data = ? WHERE cookie_key = ?", session_string, browser_key.cookie_key, function (err, rows) {
		save_callback();
		});
};

//
//
//
//

//JE: no need for `save_callback` passed as argument to `render_with_session`: `res` already knows how to make an anonymous function w/o a special argument
res.render_with_session = function render_with_session(view, locals, session_data, res, browser_key) {
	save_session_data(session_data, res, browser_key, function() {
		this.render(view, locals);
	});
};


//JE: how to make the API of `render_with_session` the same as `render`? Exploring and explaining that. One pro tip: no need to pass `res` as argument: it's already in the namespace (that's why `this` works)
res.render_with_session = function render_with_session(view, locals, session_data, browser_key) {
	save_session_data(session_data, this, browser_key, function() {
		this.render(view, locals);
	});
};
//JE: i could hide `session_data` and `browser_key` in `res` and `req`, respectively. I could do this within `get/post_with_session` wrappers, within `find_or_start_session` function. I'd do it by saving `sd` and `bk` as key/value pairs within the respective `res` and `req` objects. Then, within `render_with_session` (or just `render`), I could call `this.session_data` or `req.browser_cookie` or some junk like that. This sneaky hiding would mean I wouldn't have to change my API at all.
// (a future work flow project could be to clean up the API of all of the wrappers I've created)




//CE: does this wrapper work just like res.render()?
res.render_with_session = function render_with_session(view, locals, render_callback) {
	this.render(view, locals, function() {
		render_callback();
	});
};

//
//
//
//
//CE: attempting to include `save_session_data` in this wrapper: does it work?
res.render_with_session = function render_with_session(view, locals, render_callback) {
	this.render(view, locals, function() {
		save_session_data(session_data, res, browser_key, function() {
			render_callback();
		});
	});
};
