router.post_pg_load('/form_post_update', function(req, res, pg_load) {
	console.log('Total Page Loads After Posting Update Entry Form Page: ', pg_load);
	var query = "";
	db.all(query="UPDATE time_temp SET date=\"" + req.body["date"] + "\", time_taken=\"" + req.body["time_taken"] + "\", temp_f=" + req.body["temp_f"] + ", cycle_id=" + req.body["cycle_id"] + " WHERE id=" + req.body["id"], function(err, rows) {
		console.log("attempted to update with ((" + query + "))");
		// redirect to the cycle of the row I just updated (not defaulting to most recent cycle): 
		res.redirect('/?cycle=' + req.body["cycle_id"]);
	});
});
