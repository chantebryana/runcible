//router.get_pg_load('/login', function(req, res, pg_load) {
//router.get('/login', function(req, res) {
router.get_with_session('/login', function (req, res) {
	//console.log('Total Page Loads After Loading Login Page: ', pg_load); // not needed for future workflow, but maintaining it for now just because
	//JE: include branch that would account for someone who's already logged in but manually navigated to login page: "you're already logged in. do you want to proceed or do you want to log out and log in as someone else" or something along those lines. --> totally optional: it's also valid to forget about 'smart' code and just do 'simple' code.
	//JE: if there's no browser session, consider establishing it here -- it's the first page the user would land on, and it would make login_post.js's workflow simpler. That way a browser key is set up even if the user doesn't try to log in -- useful, especially if I'm tracking anything more than just user_auth (like my old pg_load or the date of first access or whatever cookies are used for tracking for).
	var is_logged_in = "[[not yet attempted]]";
	if (req.query.user_auth) {
		is_logged_in = req.query.user_auth;
	}
	res.render('pages/login.ejs', {
		title: 'Login',
		key_to_renderer: req.query.key,
		is_logged_in_to_renderer: is_logged_in
	});
});


