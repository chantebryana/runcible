

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
/*
//JE: no need for `save_callback` passed as argument to `render_with_session`: `res` already knows how to make an anonymous function w/o a special argument
res.render_with_session = function render_with_session(view, locals, session_data, res, browser_key) {
	save_session_data(session_data, res, browser_key, function() {
		this.render(view, locals);
	});
};
*/
/*
// this one is the one I should use:
res.render_with_session = function render_with_session(view, locals, session_data, browser_key) {
	save_session_data(session_data, this, browser_key, function() {
		this.render(view, locals);
	});
};
*/
