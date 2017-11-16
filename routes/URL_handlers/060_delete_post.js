//router.post_pg_load('/deletepost', function(req, res, pg_load) {
//router.post('/deletepost', function(req, res) {
router.post_with_auth('/deletepost', function(req, res, session_data) {
	//console.log('Total Page Loads After Posting Update Entry Form Page: ', pg_load);
	var query = "";
	db.all(query="DELETE FROM time_temp WHERE id=" + req.body["id_home"], function(err, rows) {
		console.log("attempted to delete with ((" + query + "))");
		//res.redirect('/');
		// redirect to the cycle of the row I just deleted (not defaulting to most recent cycle): 
		//res.redirect('/?cycle=' + req.body["cycle_id"]);
		res.redirect_with_session(session_data, req.cookie, '/?cycle=' + req.body["cycle_id"]);
	});
});
