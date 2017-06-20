// sandbox to better understand how javascript accesses database contents: array of objects
// run this code via terminal, using the following command: node ./array_object.js

var fam_db = [
	{id:1, date:"2017-01-01", time_taken:"07:15", temp:97.7, cycle:57}, 
	{id:2, date:"2017-01-02", time_taken:"07:00", temp:97.6, cycle:57}, 
	{id:3, date:"2017-01-03", time_taken:"07:30", temp:97.9, cycle:57}
];

console.log(Array.isArray(fam_db));
console.log(fam_db); // also tried fam_db[0] and fam_db[0].date
