router.get_pg_load('/login', function(req, res, pg_load) {
	console.log('Total Page Loads After Loading Login Page: ', pg_load); // not needed for future workflow, but maintaining it for now just because
	var is_logged_in = "";
	if (req.query.user_auth) {
		is_logged_in = req.query.user_auth;
	}
	res.render('pages/login.ejs', {
		title: 'Login',
		is_logged_in_to_renderer: is_logged_in
	});
});

/*
			if (req.query.cycle) {
				which_cycle_id = current_cycle_id;
			};
*/
