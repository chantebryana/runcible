

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
