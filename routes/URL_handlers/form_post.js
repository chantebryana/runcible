router.post_pg_load('/formpost', function(req, res, pg_load) {
	console.log('Total Page Loads After Posting New Entry Form Page: ', pg_load);
	console.log("cycle name: ");
	console.log(req.body["name"]);
	// if a new cycle is being initiated:
	if(req.body["cycle_id"] == 'new cycle') {
		// insert new name and begin_date to cycles table (which will auto-generate an id): 
		db.all("INSERT INTO cycles (name, begin_date) VALUES(\"" + req.body["name"] + "\", \"" + req.body["date"]+ "\")", function(err, rows_from_cycles_insert) {
			// look up the new cycle I just created to find out what the new id is:
			db.all("SELECT * FROM cycles WHERE name = \"" + req.body["name"] + "\"", function(err, rows_from_cycles_select) {
				console.log("rows_from_cycles_select: ");
				console.log(rows_from_cycles_select);
				// also insert new entry data into time_temp table, using the new cycle id I just looked up to link the child entry to the parent entry:
				var new_cycle_id = rows_from_cycles_select[0].id;
				db.all("INSERT INTO time_temp(date, time_taken, temp_f, cycle_id) VALUES( \"" + req.body["date"] + "\", \"" + req.body["time_taken"] + "\", \"" + req.body["temp_f"] + "\", \"" + new_cycle_id + "\")", function(err, rows_from_time_temp) {
					// after conducting all this brain work, redirect to home page: 
console.log(err);console.log("<<<<>>>>"); // JE: shows the 'contents' of object 'err'; the 'contents' aren't printed out the same way you'd expect for a regular object, such as the array results of sqlite query (this is because console.log() has special machinery to insepct and spit out objects of type 'Error'
// JE: supporting 'Error' documentation here: https://nodejs.org/api/errors.html 
//console.log(err.constructor.name); // JE: shows the type of the object 'err'
					res.redirect('/');
					//res.redirect('/?cycle=' + new_cycle_id);
				});
			});
		});
	// or else if cycle_id equals the id of an already existing cycle: 
	} else {
		// insert new entry data into time_temp (including cycle_id of existing cycle): 
		db.all("INSERT INTO time_temp (date, time_taken, temp_f, cycle_id) VALUES( \"" + req.body["date"] + "\", \"" + req.body["time_taken"] + "\", \"" + req.body["temp_f"] + "\", \"" + req.body["cycle_id"] + "\")", function(err, rows_from_time_temp) {
			// after conducting this brain work, redirect to home page: 
			// redirect to the cycle of the row I just created (not defaulting to most recent cycle): 
			res.redirect('/?cycle=' + req.body["cycle_id"]);
		});
	}
});
