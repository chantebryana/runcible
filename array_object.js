// sandbox to better understand how javascript accesses database contents: array of objects
// run this code via terminal, using the following command: node ./array_object.js

var fam_db = [
	{id:1, date:"2017-01-01", time_taken:"07:15", temp:97.7, cycle:57}, 
	{id:2, date:"2017-01-02", time_taken:"07:00", temp:97.6, cycle:57}, 
	{id:3, date:"2017-01-03", time_taken:"07:30", temp:97.9, cycle:57}
];

console.log(Array.isArray(fam_db));
console.log(fam_db); // also tried fam_db[0] and fam_db[0].date


'SELECT id FROM cycles WHERE id = "' + offset '"


//finds largest in cycles table, but I don't know how to incorporate that into code yet
sqlite> SELECT id FROM cycles ORDER BY id DESC LIMIT 1;
5


junk from index.ejs 2017/06/21
		<% // cycle_id_to_renderer %>
		<% // href="./?cycle=cycle_id_to_renderer&offset=1" %>
		<% // href="./?cycle=<%= cycle_id_to_renderer %>&offset=1" %>

junk from index.js 2017/06/21
/*
var max_cycle = function() {
	var callback = 0;
	db.all('SELECT id FROM cycles ORDER BY id DESC LIMIT 1', function(err, rows_from_db) { 
		console.log(rows_from_db[0].id);
		callback = rows_from_db[0].id;
		//return Number(rows_from_db[0].id);
	});
};

console.log(max_cycle());
//var number = max_cycle();
//console.log("number: " + number);
//var current_cycle = max_cycle();
*/


