new Date(year, month, day, hours, minutes, seconds, milliseconds)

// massages data gleaned from time_temp query into a format that can be used by chart in chartist_partial_temp.ejs (via res.render() section below); create if condition to verify that branch of code only runs if there are data points for this cycle (if time_temp query doesn't return empty or null):
var date_temp_object = []
if (rows_from_db.length != 0) {
  //console.log("running date_temp_object branch");
  for (var i = 0; i < rows_from_db.length; i++){
    // assign a new object in my array:
    date_temp_object[i] = {}; 
    // put values into new object:
    date_temp_object[i].x = "new Date (\'" + rows_from_db[i].date + "T12:30\')";
    date_temp_object[i].y = rows_from_db[i].temp_f;
  }
}


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
		datetime: '2012-10-18 00:00:00' }
]
date_temp_object[i].x = "new Date (\'" + rows_from_db[i].date + "T12:30\')";
