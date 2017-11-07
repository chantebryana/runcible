// `post` wrapper that 1) identifies or creates session_data (`post_with_session`) and 2) redirects to login page (if unauthorized) or stays put:
router.post_with_auth = function post_with_auth(url, handler_callback) {
	this.post_with_session(url, function (req, res, session_data) {
		stay_or_redirect(res, session_data, function () {
			handler_callback(req, res, session_data);
		});
	});
};
