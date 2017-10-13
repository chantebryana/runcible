// https://www.tutorialspoint.com/nodejs/nodejs_file_system.htm

var fs = require("fs");

// Chauncy's adaptation of reading directory:
// save contents to array then print out the array to console:  
console.log("Going to read directory /home/ruby/Projects/runcible/routes");
fs.readdir("/home/ruby/Projects/runcible/routes",function(err, files){
  if (err) {
    return console.error(err);
  }
	var file_array = [];
  files.forEach( function (file){
    //console.log( file );
		file_array.push(file);
  });
	file_array.forEach( function (file_array) {
		console.log(file_array);
	});
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




