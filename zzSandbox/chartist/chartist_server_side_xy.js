// try to populate {x: ,y: } array-object (with y gaps) manually 

// what var rows might look like after a db table query:
var rows = [
  { id: 192,
    date: '2012-10-15',
    time_taken: '07:30',
    temp_f: 97.7,
    cycle_id: 7,
    notes: '',
    entry_created: '2017-08-25 16:20:00',
    month_day: '10/15' },
  { id: 195,
    date: '2012-10-18',
    time_taken: '07:30',
    temp_f: 98.2,
    cycle_id: 7,
    notes: '',
    entry_created: '2017-08-25 16:20:00',
    month_day: '10/18' },
  { id: 196,
    date: '2012-10-19',
    time_taken: '09:00',
    temp_f: 98.3,
    cycle_id: 7,
    notes: '',
    entry_created: '2017-08-25 16:20:00',
    month_day: '10/19' },
  { id: 197,
    date: '2012-10-20',
    time_taken: '07:30',
    temp_f: 98.3,
    cycle_id: 7,
    notes: '',
    entry_created: '2017-08-25 16:20:00',
    month_day: '10/20' },
  { id: 198,
    date: '2012-10-21',
    time_taken: '11:30',
    temp_f: 98.2,
    cycle_id: 7,
    notes: '',
    entry_created: '2017-08-25 16:20:00',
    month_day: '10/21' }
];

// what i need to match up on chartist side: 
labels: ['', '', '', ''] // x axis text
series: [ , , , ] // y axis integers or undefined
// also consider syncing up with cycles table to determine what the beginning and end date should be (instead of relying on gap-prone time_temp table info)



// use these variables: 
// taken from cycles table: begin date and end date of current cycle: 
begin_date // eg 2012-09-23
end_date // eg 2012-10-22 or 'Today'
// useful internet resources for working w/ dates and date ranges:
// https://www.tutorialspoint.com/javascript/javascript_date_object.htm
// https://stackoverflow.com/questions/3674539/incrementing-a-date-in-javascript

// useful Node Brainstormings on Date method and date ranges: 
/*
	> begin_date = new Date();
	Mon Aug 28 2017 14:42:42 GMT-0500 (CDT)
	> var end_date = new Date();
	undefined
	> end_date.setDate(end_date.getDate() + 28);
	1506367870601
	> end_date;
	Mon Sep 25 2017 14:31:10 GMT-0500 (CDT)
	> var next_day = new Date();
	undefined
	> next_day.setDate(next_day.getDate(begin_date)+1);
	1504035208968
	> next_day;
	Tue Aug 29 2017 14:33:28 GMT-0500 (CDT)
*/

//CE: DON'T RUN THIS CODE IN NODE: MEMORY LEAK SOMEWHERE (APPARENTLY): CRASHED NODE TERMINAL:
var begin_date = new Date();
var end_date = new Date();
//end_date.setDate(end_date.getDate() + 28); 
end_date.setDate(end_date.getDate() + 5); 
var next_day = new Date();
next_day.setDate(next_day.getDate(begin_date)+1);
var date_range = [];
date_range[0] = begin_date;
date_range[1] = next_day;
next_day.setDate(next_day.getDate(next_day)+1);
date_range[2] = next_day;
next_day.setDate(next_day.getDate(next_day)+1);
date_range[3] = next_day;
next_day.setDate(next_day.getDate(next_day)+1);
date_range[4] = next_day;

/*
// here are the results of running the code above: 
	> var begin_date = new Date();
	undefined
	> var end_date = new Date();
	undefined
	> //end_date.setDate(end_date.getDate() + 28); 
	undefined
	> end_date.setDate(end_date.getDate() + 5); 
	1504383877585
	> var next_day = new Date();
	undefined
	> next_day.setDate(next_day.getDate(begin_date)+1);
	1504038277613
	> var date_range = [];
	undefined
	> date_range[0] = begin_date;
	Mon Aug 28 2017 15:24:37 GMT-0500 (CDT)
	> date_range[1] = next_day;
	Tue Aug 29 2017 15:24:37 GMT-0500 (CDT)
	> next_day.setDate(next_day.getDate(next_day)+1);
	1504124677613
	> date_range[2] = next_day;
	Wed Aug 30 2017 15:24:37 GMT-0500 (CDT)
	> next_day.setDate(next_day.getDate(next_day)+1);
	1504211077613
	> date_range[3] = next_day;
	Thu Aug 31 2017 15:24:37 GMT-0500 (CDT)
	> next_day.setDate(next_day.getDate(next_day)+1);
	1504297477613
	> date_range[4] = next_day;
	Fri Sep 01 2017 15:24:37 GMT-0500 (CDT)
	> date_range;
	[ Mon Aug 28 2017 15:24:37 GMT-0500 (CDT),
		Fri Sep 01 2017 15:24:37 GMT-0500 (CDT),
		Fri Sep 01 2017 15:24:37 GMT-0500 (CDT),
		Fri Sep 01 2017 15:24:37 GMT-0500 (CDT),
		Fri Sep 01 2017 15:24:37 GMT-0500 (CDT) ]
	> 
// it appears that next_day points to MEMORY and when it's updated it updates previous assignments too!! Thanks so much, C++ and pointers!!
*/
/*
var count = 1;
while (next_day <= end_date) {
	date_range[count] = next_day;
	count ++;
	next_day.setDate(next_day.getDate(next_day)+1);
	if (next_day > end_date) {
		break;
	} else if (count >= 100) {
		break;
	}
}
*/

// find a way to populate with iterative dates based on begin and end date (generated form cycles table): 
var date_range = [/*series of dates!*/];

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
	if (/*rows[i].date == labels[i]*/) { // if there's a date that matches label array
		series[i] = rows[i].temp_f;
	} else { // if there's no entry for this date
		series[i] = undefined;
	}


}
