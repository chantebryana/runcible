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
