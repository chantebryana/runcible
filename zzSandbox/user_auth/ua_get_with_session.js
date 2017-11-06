// first crack at assembling function set for get_with_session
// (refer to `docs/20171103 Jim wrapper notes.js` for more info

find_or_start_session = function find_or_start_session(req, res, url_handler_callback) {
	browser_cookie = req.cookies;
	if (!browser_cookie.cookie_key) { // if there is no browser cookie
		// make and save one
	} else { // if there is a browser cookie
		// check it against the database
		if () { // if it's invalid, make and save a new one

		} 
	}
	// somewhere pass forward session_data via callback. here?
};


router.get_with_session = function get_with_session(url, url_handler_callback) {
	this.get(url, function (req, res) {
		find_or_start_session(req, res, function (session_data) {
			url_handler_callback(req, res, session_data);
		});
	});
};
