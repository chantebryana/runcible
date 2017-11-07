//router.get_pg_load('/form_update', function(req, res, pg_load) {
//router.get('/form_update', function(req, res) {
router.get_with_auth('/form_update', function(req, res, session_data) {
	//console.log('Total Page Loads After Loading Update Entry Form Page: ', pg_load);
	db.all(query='SELECT * FROM time_temp WHERE id = ' + req.query.id, function(err, rows_from_db) { 
		console.log("attempted to query database with __" + query + "__");
		res.render('pages/form_update.ejs', {title: 'Form Update', row_to_renderer: rows_from_db[0]});
	});
});
