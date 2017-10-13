// https://www.tutorialspoint.com/nodejs/nodejs_file_system.htm

var fs = require("fs");

// asynchronously open a file using fs
console.log('Going to get file info!');

fs.stat('input.txt', function(err, stats) {
	if (err) {
		return console.error(err);
	}
	console.log(stats);
	console.log('Got file info successfully!');

	// check file type: 
	console.log('isFile ? ' + stats.isFile());
	console.log('isDirectory ? ' + stats.isDirectory());
});

/*
// Asynchronous read
fs.readFile('./input.txt', function (err, data) {
  if (err) {
    return console.error('<<<>>>', err);
  }
  console.log("Asynchronous read: " + data.toString());
	// eval(data.toString()); // something like that instead of console.log...
	// how to eval javascript file into local context? google (versus child or parent context)
});

// Synchronous read
//jim says use this
var data = fs.readFileSync('./input.txt');
console.log("Synchronous read: " + data.toString());
//eval line here

console.log('Program ended');
*/




