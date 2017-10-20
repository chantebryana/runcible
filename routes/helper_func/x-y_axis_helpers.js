// 6 functions that find and define the values of y-axis and labels for x-axis for chartist chart:
// to be used in router.get('/'...): 

// pull the dates logged in time_temp table and populate into array dates_logged (used in comparison_key() ):
logged_dates = function logged_dates(rows_from_db) {
	var dates_logged = [];
	for (var i = 0; i < rows_from_db.length; i++) {
		dates_logged[i] = new Date(rows_from_db[i].datetime);
	}
	//console.log('dates_logged: \n', dates_logged);
	return dates_logged	
}
// pull begin and end datetimes from cycles table and auto-populate a series of dates into full_date_range array (used in comparison_key() and populate_x_axis_labels() ): 
auto_compute_date_range = function auto_compute_date_range(next_cycle_id, dates_from_db, rows_from_db) {
	// define beginning datetime based on db query results:
	var begin_datetime = new Date(dates_from_db[0].begin_datetime);
	// define ending datetime based on db query results, with conditions based on whether it's accessing a complete or incomplete cycle (if complete, get end_datetime from 'cycles' table query results, else get from 'time_temp' table query restuls):
	if(next_cycle_id){
		var end_datetime = new Date(dates_from_db[1].end_datetime);
	} else {
		var end_datetime = new Date(rows_from_db[rows_from_db.length-1].datetime);
	}
	var full_date_range = [];
	// create for loop to push full date range (based on beginning and end datetimes) into array full_date_range (this loop does work for time change):
	for (var i = begin_datetime; i <= end_datetime; i.setDate(i.getDate() + 1)) {
		full_date_range.push(new Date(i));
	}
	//console.log('full_date_range: \n', full_date_range);
	// return the date range array for future use elsewhere:
	return full_date_range;
}
// compare dates_logged against full_date_range, and populate a new a_match array with 0's or 1's, depending on whether there's a match (0 == false, 1 == true). this is a helper function for many of the other methods below:
comparison_key = function comparison_key(full_date_range, dates_logged) {
	var a_match = [];
	var count = 0;
	for (var j = 0; j < full_date_range.length; j++) {
		if (full_date_range[j] - dates_logged[count] == 0) { // can't directly compare two date objects, but I can indirectly manipulate their results for comparison
			a_match[j] = 1; // 1 == 'true' match
			count ++;
		} else {
			a_match[j] = 0; // 0 == 'false' clash
		}
	}
	//console.log('a_match: ', a_match);
	return a_match;
}
// pull temp_f data from time_temp table; iterate over a_match (from comparison_key() ): if element is 1, then fill the same-indexed element of y_temp_f array with the temp_f data from time_temp table; else, fill y_temp_f with 'undefined'. y_temp_f feeds directly to chartist chart, and the undefined elements show up as gaps in the chart: 
populate_y_axis_data = function populate_y_axis_data(a_match, rows_from_db) {
	var y_temp_f = [];
	var count = 0;
	for (var i = 0; i < a_match.length; i++) {
		if (a_match[i] == 1) { // if match == true
			y_temp_f[i] = rows_from_db[count].temp_f;
			count ++;
		} else { // if match == false
			y_temp_f[i] = undefined;
		}
	}
	//console.log('y_temp_f: ', y_temp_f);
	return y_temp_f;
}
// pull time_taken data from time_temp table; iterate over a_match(from comparison_key() ): if element is 1, then fill the same-indexed element of x_time_taken array with the time_taken data from time_temp table; else, fill x_time_taken with '' empty string. x_time_taken array will be used later in populate_x_axis_labels() to populate the labels for the x-axis of chartist chart:  
logged_time_taken = function logged_time_taken(a_match, rows_from_db) {
	var x_time_taken = [];
	var count = 0;
	for (var i = 0; i < a_match.length; i++) {
		if (a_match[i] == 1) { // if match == true
			x_time_taken[i] = rows_from_db[count].time_taken;
			count ++;
		} else { // if match == false
			x_time_taken[i] = "_____";
		}
	}
	//console.log('x_time_taken: ', x_time_taken);
	return x_time_taken;
}
// populate the labels for the x-axis of chartist chart with array x_label_values.  Include data from full_date_range (from auto_compute_date_range() ) and x_time_taken (from logged_time_taken() ), with gaps in data as appropriate (the time_taken value is just an empty string '' if there's no y-axis temp_f, for instance): 
populate_x_axis_labels = function populate_x_axis_labels(full_date_range, x_time_taken) {
	var x_label_values = []
	var cycle_count = 1;
	var count = 0;
	var days_of_the_week = ["S", "M", "T", "W", "T", "F", "S"];
	for (var i = 0; i < full_date_range.length; i++) {
		// define to individual variables for simplicy: 
		var month = (full_date_range[i].getMonth() + 1);
		var date = full_date_range[i].getDate();
		var day = days_of_the_week[full_date_range[i].getDay()];
		//var time_taken = rows_from_db[i].time_taken;
		var time_taken = x_time_taken[i];
		// full_string_dates[i] = (full_date_range[i].getMonth() + 1) + "-" + full_date_range[i].getDate();
		x_label_values[i] = "\"" + cycle_count + "\\n" + day + "\\n" + month + "-" + date + "\\n" + time_taken + "\"";
		// x_label_values[i] = "\"" + month + "-" + date + "\\n" + time_taken + "\"";
		cycle_count ++;
	}
	//console.log('x_label_values: \n', x_label_values);
	return x_label_values;
}
