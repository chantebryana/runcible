// `get` wrapper that identifies or creates session_data:
router.get_with_session = function get_with_session(url, url_handler_callback) {
	this.get(url, function (req, res) {
		find_or_start_session(req, res, function (session_data) {
			url_handler_callback(req, res, session_data);
		});
	});
};

// `post` wrapper that identifies or creates session_data:
router.post_with_session = function post_with_session(url, url_handler_callback) {
	this.post(url, function (req, res) {
		find_or_start_session(req, res, function (session_data) {
			url_handler_callback(req, res, session_data);
		});
	});
};
