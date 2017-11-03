// I've already ran check_browser_cookie() in an earlier stage of events (before switching over to login page). So remove that function from the box.
// I already know that (for simplicity / a starting point) that there is no browser session or browser cookie, but that I did log in successfully. So what next? 

function make_id_b() {
	var text = "";
	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

	for (var i = 0; i < 6; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	};
	console.log("make_id() return value: ", text);
	return text;
}

function insert_new_id_and_user_auth_to_db_table(new_cookie_key, user_auth, callback) {
	db.run_smart("INSERT INTO ce_session_data (cookie_key, session_data) VALUES (\"" + new_cookie_key + "\", '{\"user_auth\":\"" + user_auth + "\"}')", function(err, rows) {
		console.log("insert_new_id_and_user_auth_to_db_table() ran!");
		callback();
	});
}

// CE: if I've already got an assigned browser session then this is the only function that matters. Unfortunately for me, this is the function that seems to be breaking
// CE: ugh, nevermind. accessing cookie_key_json table would mean making changes to increment_pg_load() function in 020_cookie_pg_load_helpers.js That sounds like a lot of work.
function insert_user_auth_to_db_table(new_cookie_key, user_auth, callback) {
	db.run_smart("UPDATE cookie_key_json SET session_data = ", function(err, rows) {

	});
}

function save_new_cookie_id_to_browser_b(res, new_cookie_key) {
	res.setHeader('Set-Cookie', cookie.serialize('cookie_key', new_cookie_key));
	console.log("save_new_cookie_id_to_browser() ran!");
}

create_and_save_session_data = function create_and_save_session_data(res, user_auth, callback) {
	var secret_cookie_id = make_id_b();
	insert_new_id_and_user_auth_to_db_table(secret_cookie_id, user_auth, function() {
		save_new_cookie_id_to_browser_b(res, secret_cookie_id);
		callback(secret_cookie_id);
	});
}



//router.get_pg_load('/logged_in', function(req, res, pg_load) {
router.get('/logged_in', function(req, res) {
	//console.log('Total Page Loads After Loading Login Page: ', pg_load); // not needed for future workflow, but maintaining it for now just because

	var is_logged_in = "[[not yet attempted]]";
	if (req.query.user_auth) {
		is_logged_in = req.query.user_auth;
	}
	create_and_save_session_data(res, is_logged_in, function(new_cookie_key) {
		callback(new_cookie_key); // JE: instead of callback, put 'res.render' lines within this anonymous function, or something. I took the inner layers of the original 'check_browser_cookie()' without properly separating out its pieces. Ie, line 2 of cookie_pg_load_helpers.js has the outer function call (w/ a callback argument passed), and then has the inner layer, which I tried to crudely splice in here, with loads of errors.
	});

	res.render('pages/logged_in.ejs', {
		title: 'Logged In',
		is_logged_in_to_renderer: is_logged_in, 
		cookie_key_to_renderer: new_cookie_key // this is where the terminal's upset
	});
});


