// pseudocode notepad!! based on outline notes from EOD 2017-10-30

function new_session_row(new_cookie_key, callback) {
	db.run_smart("INSERT INTO browser_session (cookie_key, session_data) VALUES (\"" + new_cookie_key + "\", '{\"user_auth\":\"false\"}')", function(err, rows) {
		callback(/*arg?*/);
	});
};

function user_auth_true(browser_cookie_key, callback) {
	db.run_smart("UPDATE browser_session SET session_data = '{\"user_auth\":\"true\"}' WHERE cookie_key = \"" + browser_cookie_key + "\"", function(err, rows) {
		callback(/*arg?*/);
	});
};


// how do the two functions nest together? the callbacks are all wrong I'm sure: how to make them do what they're supposed to do? how do adapt these functions as the session_data field gets more complicated (I'd need to store and pass that variable around, just like the cookie_key variable). 
// all good questions, but don't get lost in the minutia just yet.

// hmm, that doesn't quite work. variable browser_cookie works as a true/false message forward, but it doesn't save the actual browser if there is one. how to account for this???????? right now the uses of 'browser_cookie' won't work!
//function stuff(browser_cookie) {
// don't need to pass req.query.key to this func, since it should already exist in the namespace via the URL handler:
function stuff(/*arg?*/) {
	//if (browser_cookie == false) { // or however I decide to save and pass that data forward from check_browser_cookie()
	if (req.query.key == null) {
		var new_key = make_id();
		save_new_cookie_id_to_browser(res, new_key);
		new_session_row(new_key, function(/*arg?*/){
			user_auth_true(new_key, function(/*arg?*/) {
				callback(/*arg?*/);
			});
		});
	} else { // if there's already an inauthenticated browser session
		//user_auth_true(browser_cookie, function (/*arg?*/) {
		user_auth_true(req.query.key, function(/*arg?*/)) {
			callback(/*arg?*/);
		});
	}
};

//
//
//
//
// maybe I should draft an updated check_browser_cookie function, since the variables passed forward there affects all of the following functions (and has got me kinda stuck, to be honest).
// check_browser_cookie function will be performed in outside URL handler. If I pass certain criteria, then the user will get res.redirect-ed to the login page (along with some data getting passed forward too)
// this function will probably even live within router.get and router.post, but one thing at a time.
function check_browser_cookie(req, res, callback){
	var browser_cookie_key = req.cookies;
	db.run_smart("SELECT session_data FROM browser_session WHERE cookie_key = \"" + browser_cookie_key.cookie_key + "\"", function(err, rows) {
		if (rows.length == 0) {
			//res.redirect("/login?key=null&user_auth=false");
			res.redirect("/login?key=null"); // don't need to pass user_auth b/c it'll automatically be false if I'm redirecting to login page!
		} else {
			var parsed_session_data = JSON.parse(rows[0].session_data);
			// if unauthorized browser session
			if (parsed_session_data.user_auth == false) {
				//res.redirect("/login?key=\"" + rows[0].cookie_key + "\"&user_auth=false");
				res.redirect("/login?key=\"" + rows[0].cookie_key + "\"");// don't need to pass user_auth b/c it'll automatically be false if I'm redirecting to login page!
			} else { // if fully authorized browser session; ie, if parsed_session_data.user_auth == true
				// proceed to page as normal!
			}
		}
	});
}
