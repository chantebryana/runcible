// trying to fix chartist time change regression. 
// see also data on zzSandbox/chartist/blackboard2.js
// following code adapted from https://stackoverflow.com/questions/4345045/javascript-loop-between-date-ranges

var now = new Date();
var daysOfYear = [];
var maxDate = new Date(2012, 10, 16);
//for (var d = new Date(2012, 10, 03); d <= '2012-11-15'; d.setDate(d.getDate() + 1)) {
for (var d = new Date(2012, 10, 03); d <= maxDate; d.setDate(d.getDate() + 1)) {
    daysOfYear.push(new Date(d));
}

daysOfYear;

var begin_datetime = new Date(dates_from_db[0].begin_datetime);
if(next_cycle_id){
	var end_datetime = new Date(dates_from_db[1].end_datetime);
} else {
	var end_datetime = new Date(rows_from_db[rows_from_db.length-1].datetime);
}
var full_date_range = [];
for (var i = begin_datetime; i <= end_datetime; i.setDate(i.getDate() + 1))) {
	full_date_range.push(new Date(i));
}
