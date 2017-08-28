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

// blatently ripped this off from the interent, but it works!
// https://stackoverflow.com/questions/7114152/given-a-start-and-end-date-create-an-array-of-the-dates-between-the-two
> var start = new Date ("August 13, 2011");
undefined
> start;
Sat Aug 13 2011 00:00:00 GMT-0500 (CDT)
> var end = new Date ("October 13, 2011");
undefined
> end;
Thu Oct 13 2011 00:00:00 GMT-0500 (CDT)
> var range = [];
undefined
> var mil = 86400000;
undefined
> mil
86400000
> range
[]
> for (var i = start.getTime(); i < end.getTime(); i = i+mil) {
...   range.push(new Date(i));
... }
61
// results: 
> range;
[ Sat Aug 13 2011 00:00:00 GMT-0500 (CDT),
  Sun Aug 14 2011 00:00:00 GMT-0500 (CDT),
  Mon Aug 15 2011 00:00:00 GMT-0500 (CDT),
  Tue Aug 16 2011 00:00:00 GMT-0500 (CDT),
  Wed Aug 17 2011 00:00:00 GMT-0500 (CDT),
  Thu Aug 18 2011 00:00:00 GMT-0500 (CDT),
  Fri Aug 19 2011 00:00:00 GMT-0500 (CDT),
  Sat Aug 20 2011 00:00:00 GMT-0500 (CDT),
  Sun Aug 21 2011 00:00:00 GMT-0500 (CDT),
  Mon Aug 22 2011 00:00:00 GMT-0500 (CDT),
  Tue Aug 23 2011 00:00:00 GMT-0500 (CDT),
  Wed Aug 24 2011 00:00:00 GMT-0500 (CDT),
  Thu Aug 25 2011 00:00:00 GMT-0500 (CDT),
  Fri Aug 26 2011 00:00:00 GMT-0500 (CDT),
  Sat Aug 27 2011 00:00:00 GMT-0500 (CDT),
  Sun Aug 28 2011 00:00:00 GMT-0500 (CDT),
  Mon Aug 29 2011 00:00:00 GMT-0500 (CDT),
  Tue Aug 30 2011 00:00:00 GMT-0500 (CDT),
  Wed Aug 31 2011 00:00:00 GMT-0500 (CDT),
  Thu Sep 01 2011 00:00:00 GMT-0500 (CDT),
  Fri Sep 02 2011 00:00:00 GMT-0500 (CDT),
  Sat Sep 03 2011 00:00:00 GMT-0500 (CDT),
  Sun Sep 04 2011 00:00:00 GMT-0500 (CDT),
  Mon Sep 05 2011 00:00:00 GMT-0500 (CDT),
  Tue Sep 06 2011 00:00:00 GMT-0500 (CDT),
  Wed Sep 07 2011 00:00:00 GMT-0500 (CDT),
  Thu Sep 08 2011 00:00:00 GMT-0500 (CDT),
  Fri Sep 09 2011 00:00:00 GMT-0500 (CDT),
  Sat Sep 10 2011 00:00:00 GMT-0500 (CDT),
  Sun Sep 11 2011 00:00:00 GMT-0500 (CDT),
  Mon Sep 12 2011 00:00:00 GMT-0500 (CDT),
  Tue Sep 13 2011 00:00:00 GMT-0500 (CDT),
  Wed Sep 14 2011 00:00:00 GMT-0500 (CDT),
  Thu Sep 15 2011 00:00:00 GMT-0500 (CDT),
  Fri Sep 16 2011 00:00:00 GMT-0500 (CDT),
  Sat Sep 17 2011 00:00:00 GMT-0500 (CDT),
  Sun Sep 18 2011 00:00:00 GMT-0500 (CDT),
  Mon Sep 19 2011 00:00:00 GMT-0500 (CDT),
  Tue Sep 20 2011 00:00:00 GMT-0500 (CDT),
  Wed Sep 21 2011 00:00:00 GMT-0500 (CDT),
  Thu Sep 22 2011 00:00:00 GMT-0500 (CDT),
  Fri Sep 23 2011 00:00:00 GMT-0500 (CDT),
  Sat Sep 24 2011 00:00:00 GMT-0500 (CDT),
  Sun Sep 25 2011 00:00:00 GMT-0500 (CDT),
  Mon Sep 26 2011 00:00:00 GMT-0500 (CDT),
  Tue Sep 27 2011 00:00:00 GMT-0500 (CDT),
  Wed Sep 28 2011 00:00:00 GMT-0500 (CDT),
  Thu Sep 29 2011 00:00:00 GMT-0500 (CDT),
  Fri Sep 30 2011 00:00:00 GMT-0500 (CDT),
  Sat Oct 01 2011 00:00:00 GMT-0500 (CDT),
  Sun Oct 02 2011 00:00:00 GMT-0500 (CDT),
  Mon Oct 03 2011 00:00:00 GMT-0500 (CDT),
  Tue Oct 04 2011 00:00:00 GMT-0500 (CDT),
  Wed Oct 05 2011 00:00:00 GMT-0500 (CDT),
  Thu Oct 06 2011 00:00:00 GMT-0500 (CDT),
  Fri Oct 07 2011 00:00:00 GMT-0500 (CDT),
  Sat Oct 08 2011 00:00:00 GMT-0500 (CDT),
  Sun Oct 09 2011 00:00:00 GMT-0500 (CDT),
  Mon Oct 10 2011 00:00:00 GMT-0500 (CDT),
  Tue Oct 11 2011 00:00:00 GMT-0500 (CDT),
  Wed Oct 12 2011 00:00:00 GMT-0500 (CDT) ]


/*
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
// the same goes for assigning 'raw' variables (versus 'pointer' arrays) to date variables: if I change the date variable, the 'raw' variable changes too:
	> var next_day = new Date();
	undefined
	> next_day.setDate(next_day.getDate(begin_date)+1);
	1504038674604
	> var temp_date = next_day;
	undefined
	> temp_date;
	Tue Aug 29 2017 15:31:14 GMT-0500 (CDT)
	> next_day.setDate(next_day.getDate(next_day)+1);
	1504125074604
	> temp_date;
	Wed Aug 30 2017 15:31:14 GMT-0500 (CDT)

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
