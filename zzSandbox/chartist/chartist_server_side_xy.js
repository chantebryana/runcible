// try to populate {x: ,y: } array-object (with y gaps) manually 

// what var rows might look like after a db table query:

/*
// code from index.js that queries cycle table to find beginning and end dates of currently displayed cycle: 
db.all('SELECT begin_date, date(begin_date, \'-1 day\') as \'yesterday\' FROM cycles WHERE id = ' + which_cycle_id + ' or id = ' + id_search_var + ' ORDER BY begin_date', function(err, dates_from_db){
	if (next_cycle_id) {
		var begin_date = dates_from_db[0].begin_date;
		var end_date = dates_from_db[1].yesterday;
	} else {
		var begin_date = dates_from_db[0].begin_date;
		var end_date = 'Today';
	};
});
*/
// if there's a next cycle: 
var cycles_rows = [
	{ begin_date: '2012-09-23', 
		yesterday: '2012-09-22' }, 
	{ begin_date: '2012-10-23', 
		yesterday: '2012-10-22' }
]
// if this is the last cycle (no next cycle): 
var cycles_rows = [
	{ begin_date: '2012-11-21', 
		yesterday: '2012-11-20' }, 
	{ begin_date: '2012-11-21', 
		yesterday: '2012-11-20' }
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

// helpful resources: 
// https://www.toptal.com/software/definitive-guide-to-datetime-manipulation:
// https://www.tutorialspoint.com/javascript/javascript_date_object.htm
var dates_logged = [];
for (var i = 0; i < rows.length; i++) {
	dates_logged[i] = new Date(rows[i].datetime);
}
console.log(dates_logged);
/* returns: 
[ Mon Oct 15 2012 00:00:00 GMT-0500 (CDT),
  Thu Oct 18 2012 00:00:00 GMT-0500 (CDT),
  Fri Oct 19 2012 00:00:00 GMT-0500 (CDT),
  Sat Oct 20 2012 00:00:00 GMT-0500 (CDT),
  Sun Oct 21 2012 00:00:00 GMT-0500 (CDT) ]
*/


// https://stackoverflow.com/questions/7114152/given-a-start-and-end-date-create-an-array-of-the-dates-between-the-two
var start = new Date(rows[0].datetime);
var end = new Date(rows[rows.length-1].datetime);
var full_date_range = [];
var mil = (1000*60*60*24)// 24 hr in miliseconds
// add mil to end.getTime() to add one more day to the iteration range:
for (var i = start.getTime(); i < (end.getTime() + mil); i = i + mil) {
	full_date_range.push(new Date(i));
}
console.log(full_date_range);
/* returns: 
[ Mon Oct 15 2012 00:00:00 GMT-0500 (CDT),
  Tue Oct 16 2012 00:00:00 GMT-0500 (CDT),
  Wed Oct 17 2012 00:00:00 GMT-0500 (CDT),
  Thu Oct 18 2012 00:00:00 GMT-0500 (CDT),
  Fri Oct 19 2012 00:00:00 GMT-0500 (CDT),
  Sat Oct 20 2012 00:00:00 GMT-0500 (CDT),
  Sun Oct 21 2012 00:00:00 GMT-0500 (CDT) ]
*/

// compare full_date_range against dates_logged, and populate an array that says whether the match is true (1) or false(0): 
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
// returns: 
// [ 1, 0, 0, 1, 1, 1, 1 ]

// populate y axis datapoints based on a_match:
y_temp_f = [];
count = 0;
for (var i = 0; i < a_match.length; i++) {
	if (a_match[i] == 1) { // if match == true
		y_temp_f[i] = rows[count].temp_f;
		count ++;
	} else { // if match == false
		y_temp_f[i] = undefined;
	}
}
console.log(y_temp_f);
// returns: 
// [ 97.7, undefined, undefined, 98.2, 98.3, 98.3, 98.2 ]

// populate time_taken array, inserting null values if no match: 
x_time_taken = [];
count = 0;
for (var i = 0; i < a_match.length; i++) {
	if (a_match[i] == 1) { // if match == true
		x_time_taken[i] = rows[count].time_taken;
		count ++;
	} else { // if match == false
		x_time_taken[i] = "";
	}
}
console.log(x_time_taken);
// returns: 
// [ '07:30', '', '', '07:30', '09:00', '07:30', '11:30' ]


// translation notes: 
var x_label_values = []
var cycle_count = 1;
count = 0;
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
// returns: 
/*
[ '1\nM\n10-15\n07:30',
  '2\nT\n10-16\n',
  '3\nW\n10-17\n',
  '4\nT\n10-18\n07:30',
  '5\nF\n10-19\n09:00',
  '6\nS\n10-20\n07:30',
  '7\nS\n10-21\n11:30' ]
*/




// what i need to match up on chartist side: 
/*
labels: ['', '', '', ''] // x axis text
series: [ , , , ] // y axis integers or undefined
*/
// also consider syncing up with cycles table to determine what the beginning and end date should be (instead of relying on gap-prone time_temp table info)



// use these variables: 
// taken from cycles table: begin date and end date of current cycle: 
/*
begin_date // eg 2012-09-23
end_date // eg 2012-10-22 or 'Today'


// find a way to populate with iterative dates based on begin and end date (generated form cycles table): 
var date_range = [series of dates!];

for (var i = 0; i < rows.length; i++) { // i don't know which 'rows' i'll be using here
	if(end_date != 'Today') {
		// use end_date from cycles as the logic point
		labels[i] = date_range[i]
	} else {
		// use end_date_int from time_temp table as logic point
		labels[i] = rows_from_db[i].date // i'm pretty sure this is right
	}
}

for (var i = 0; i < rows.length; i++) { // i don't know which 'rows' i'll be using here
	if (rows[i].date == labels[i]) { // if there's a date that matches label array
		series[i] = rows[i].temp_f;
	} else { // if there's no entry for this date
		series[i] = undefined;
	}


}
*/


