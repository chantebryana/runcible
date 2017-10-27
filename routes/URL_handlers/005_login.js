router.get_pg_load('/login', function(req, res, pg_load) {
	console.log('Total Page Loads After Loading Login Page: ', pg_load); // not needed for future workflow, but maintaining it for now just because
	res.render('pages/login.ejs', {title: 'Login'});
});

/*
			if (req.query.cycle) {
				which_cycle_id = current_cycle_id;
			};
*/
