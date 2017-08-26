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
