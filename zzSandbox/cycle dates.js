
db.all('SELECT begin_date, date(begin_date, \'-1 day\') as \'yesterday\' FROM cycles WHERE id = ' + next_cycle_id, function(err, end_date_from_db){
	console.log(err);
	console.log('<<<<<<>>>>>>');
	var end_date = end_date_from_db[0].yesterday;
	console.log(end_date);

	db.all('SELECT begin_date FROM cycles WHERE id = ' + which_cycle_id, function(err, begin_date_from_db){
		console.log(err);
		console.log('<<<<<<>>>>>>');
		var begin_date = begin_date_from_db[0].begin_date
		console.log(begin_date);
	});
});

//find beginning and end dates of currently displayed cycle: 
db.all('SELECT begin_date, date(begin_date, \'-1 day\') as \'yesterday\' FROM cycles WHERE id = ' + which_cycle_id + ' or id = ' + next_cycle_id, function(err, dates_from_db){
	var begin_date = dates_from_db[0].begin_date;
	var end_date = dates_from_db[1].yesterday;
});

... 
res.render( ... {
	// render beginning and end dates of currently displayed cycle to index.ejs:
	begin_date = begin_date_to_renderer,
	end_date = end_date_to_renderer, 


	begin_date_to_renderer: begin_date,
	end_date_to_renderer: end_date,
...
});
