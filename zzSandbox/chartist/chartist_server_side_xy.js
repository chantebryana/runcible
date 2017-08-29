// try to populate {x: ,y: } array-object (with y gaps) manually 

// what var rows might look like after a db table query:
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
*/
// useful Node Brainstormings on Date method and date ranges: 


// helpful resource: https://www.toptal.com/software/definitive-guide-to-datetime-manipulation:
var dates_logged = [];
for (var i = 0; i < rows.length; i++) {
	dates_logged[i] = new Date(rows[i].datetime);
}
console.log(dates_logged);
/*
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
/*
[ Mon Oct 15 2012 00:00:00 GMT-0500 (CDT),
  Tue Oct 16 2012 00:00:00 GMT-0500 (CDT),
  Wed Oct 17 2012 00:00:00 GMT-0500 (CDT),
  Thu Oct 18 2012 00:00:00 GMT-0500 (CDT),
  Fri Oct 19 2012 00:00:00 GMT-0500 (CDT),
  Sat Oct 20 2012 00:00:00 GMT-0500 (CDT),
  Sun Oct 21 2012 00:00:00 GMT-0500 (CDT) ]
*/

// translation notes: 
/*
> combination = (full_date_range[0].getMonth() + 1) + "-" + full_date_range[0].getDate();
'10-15'
*/

var combination = []
for (var i = 0; i < full_date_range.length; i++) {
	combination[i] = (full_date_range[i].getMonth() + 1) + "-" + full_date_range[i].getDate();
}
console.log(combination);


//CE more playing around: 
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


/*
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
