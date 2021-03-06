// pull the dates logged in time_temp table and populate into array dates_logged:
function logged_dates() {
	var dates_logged = [];
	for (var i = 0; i < rows_from_db.length; i++) {
		dates_logged[i] = new Date(rows_from_db[i].datetime);
	}
	return dates_logged	
}
// pull begin and end datetimes from cycles table and auto-populate a series of dates into full_date_range array: 
function auto_compute_date_range() {
	var begin_datetime = new Date(dates_from_db[0].begin_datetime);
	var end_datetime = new Date(dates_from_db[1].end_datetime);
	var full_date_range = [];
	var mil = (1000*60*60*24)// 24 hr in miliseconds
	// add mil to end_datetime.getTime() to add one more day to the iteration range:
	for (var i = begin_datetime.getTime(); i < (end_datetime.getTime() + mil); i = i + mil) {
		full_date_range.push(new Date(i));
	}
	return full_date_range;
}
// compare dates_logged against full_date_range, and populate a new a_match array with 0's or 1's, depending on whether there's a match (0 == false, 1 == true):
function comparison_key(full_date_range, dates_logged) {
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
	return a_match;
}
// pull temp_f data from time_temp table; iterate over a_match: if element is 1, then fill the same-indexed element of y_temp_f array with the temp_f data from time_temp table; else, fill y_temp_f with 'undefined'. y_temp_f feeds directly to chartist chart, and the undefined elements show up as gaps in the chart: 
function populate_y_axis_data(a_match) {
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
	return y_temp_f;
}
// pull time_taken data from time_temp table; iterate over a_match: if element is 1, then fill the same-indexed element of x_time_taken array with the time_taken data from time_temp table; else, fill x_time_taken with '' empty string. x_time_taken array will be used later to populate the labels for the x-axis of chartist chart:  
function logged_time_taken(a_match) {
	var x_time_taken = [];
	var count = 0;
	for (var i = 0; i < a_match.length; i++) {
		if (a_match[i] == 1) { // if match == true
			x_time_taken[i] = rows_from_db[count].time_taken;
			count ++;
		} else { // if match == false
			x_time_taken[i] = "";
		}
	}
	return x_time_taken;
}
// populate the labels for the x-axis of chartist chart with array x_label_values.  Include data from full_date_range and time_taken, with gaps in data as appropriate (the time_taken value is just an empty string '' if there's no y-axis temp_f, for instance): 
function populate_x_axis_labels(full_date_range, x_time_taken) {
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
		x_label_values[i] = cycle_count + "\n" + day + "\n" + month + "-" + date + "\n" + time_taken;
		cycle_count ++;
	}
	return x_label_values;
}

