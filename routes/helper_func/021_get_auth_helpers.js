// helper functions for `get_with_auth`, a `get` wrapper

// redirects to login page if session_data isn't authorized, else it passes namespace arguments (res, req, session_data) forward:
stay_or_redirect = function stay_or_redirect(res, session_data, callback) {
	if (session_data.user_auth != 'true') {
		console.log("stay_or_redirect() -> unauthorized session data");
		return res.redirect("/login");
	} else {
		console.log("stay_or_redirect() -> authorized session data");
		callback();
	}
};
