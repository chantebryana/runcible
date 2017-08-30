// try to populate {x: ,y: } array-object (with y gaps) manually 
// what var rows might look like after a db table query:
var dates_from_db = [
	{ begin_date: '2012-10-15',
		end_date: '2012-10-14',
		begin_datetime: '2012-10-15 00:00:00',
		end_datetime: '2012-10-14 00:00:00' }, 
	{ begin_date: '2012-10-23',
		end_date: '2012-10-22',
		begin_datetime: '2012-10-23 00:00:00',
		end_datetime: '2012-10-22 00:00:00' }
]

/* datetime created from this query: 
SELECT *, strftime('%Y-%m-%d %H:%M:%S', date) as 'datetime' FROM time_temp WHERE cycle_id = 7 ORDER BY id;
*/
var rows = [
  { id: 192,
    date: '2012-10-15',
    time_taken: '07:30',
    temp_f: 97.7,
    cycle_id: 7,
    notes: '',
    entry_created: '2017-08-25 16:20:00',
    //month_day: '10/15' },
		datetime: '2012-10-15 00:00:00' },
  { id: 195,
    date: '2012-10-18',
    time_taken: '07:30',
    temp_f: 98.2,
    cycle_id: 7,
    notes: '',
    entry_created: '2017-08-25 16:20:00',
    //month_day: '10/18' },
		datetime: '2012-10-18 00:00:00' },
  { id: 196,
    date: '2012-10-19',
    time_taken: '09:00',
    temp_f: 98.3,
    cycle_id: 7,
    notes: '',
    entry_created: '2017-08-25 16:20:00',
    //month_day: '10/19' },
		datetime: '2012-10-19 00:00:00' },
  { id: 197,
    date: '2012-10-20',
    time_taken: '07:30',
    temp_f: 98.3,
    cycle_id: 7,
    notes: '',
    entry_created: '2017-08-25 16:20:00',
    //month_day: '10/20' },
		datetime: '2012-10-20 00:00:00' },
  { id: 198,
    date: '2012-10-21',
    time_taken: '11:30',
    temp_f: 98.2,
    cycle_id: 7,
    notes: '',
    entry_created: '2017-08-25 16:20:00',
    //month_day: '10/21' }
		datetime: '2012-10-21 00:00:00' }
];

// black boxes: 
function logged_dates(callback) {
	var dates_logged = [];
	for (var i = 0; i < rows.length; i++) {
		dates_logged[i] = new Date(rows[i].datetime);
	}
	console.log(dates_logged);
	callback(dates_logged);	
}

function auto_compute_date_range(callback) {
	var begin_datetime = new Date(dates_from_db[0].begin_datetime);
	var end_datetime = new Date(dates_from_db[1].end_datetime);
	var full_date_range = [];
	var mil = (1000*60*60*24)// 24 hr in miliseconds
	// add mil to end_datetime.getTime() to add one more day to the iteration range:
	for (var i = begin_datetime.getTime(); i < (end_datetime.getTime() + mil); i = i + mil) {
		full_date_range.push(new Date(i));
	}
	console.log(full_date_range);
	callback(full_date_range);
}

function comparison_key(full_date_range, dates_logged, callback) {
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
	console.log(a_match);
	callback(a_match);
}

function populate_y_axis_data(a_match, callback) {
	var y_temp_f = [];
	var count = 0;
	for (var i = 0; i < a_match.length; i++) {
		if (a_match[i] == 1) { // if match == true
			y_temp_f[i] = rows[count].temp_f;
			count ++;
		} else { // if match == false
			y_temp_f[i] = undefined;
		}
	}
	console.log(y_temp_f);
	callback(y_temp_f);
}

function logged_time_taken(a_match, callback) {
	var x_time_taken = [];
	var count = 0;
	for (var i = 0; i < a_match.length; i++) {
		if (a_match[i] == 1) { // if match == true
			x_time_taken[i] = rows[count].time_taken;
			count ++;
		} else { // if match == false
			x_time_taken[i] = "";
		}
	}
	console.log(x_time_taken);
	callback(x_time_taken);
}

function populate_x_axis_labels(full_date_range, x_time_taken, callback) {
	var x_label_values = []
	var cycle_count = 1;
	var count = 0;
	var days_of_the_week = ["S", "M", "T", "W", "T", "F", "S"];
	for (var i = 0; i < full_date_range.length; i++) {
		// define to individual variables for simplicy: 
		var month = (full_date_range[i].getMonth() + 1);
		var date = full_date_range[i].getDate();
		var day = days_of_the_week[full_date_range[i].getDay()];
		//var time_taken = rows[i].time_taken;
		var time_taken = x_time_taken[i];
		// full_string_dates[i] = (full_date_range[i].getMonth() + 1) + "-" + full_date_range[i].getDate();
		x_label_values[i] = cycle_count + "\n" + day + "\n" + month + "-" + date + "\n" + time_taken;
		cycle_count ++;
	}
	console.log(x_label_values);
	callback(x_label_values);
}

// running the functions: 
logged_dates(function(dates_logged){
	auto_compute_date_range(function(full_date_range) {
		comparison_key(full_date_range, dates_logged, function(a_match){
			populate_y_axis_data(a_match, function(y_temp_f) {
				logged_time_taken(a_match, function(x_time_taken) {
					populate_x_axis_labels(full_date_range, x_time_taken, function(x_label_values) {

					});
				});
			});
		});
	});
});
