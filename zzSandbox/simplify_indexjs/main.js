// https://www.tutorialspoint.com/nodejs/nodejs_file_system.htm

var fs = require("fs");

// asynchronously create a directory using fs (creates directory at root: tricky because 'tmp' already existed: I don't want to mess that up!)
// if I try to create a new directory 'test' in another new directory 'chompy', I get error messages. apparently i need to create a new directory within an existing framework, an additional already existing directory. playing more with this.
console.log('Going to create directory /tmp/test');

//fs.mkdir('/tmp/test', function(err) {
fs.mkdir('/chompy/test', function(err) {
	if (err) {
		return console.error(err);
	}
	console.log('Directory created successfully!');
});

// asynchronously open a directory using fs
console.log('Going to read directory /tmp');

// fs.readdir('/tmp/', function(err, files) {
fs.readdir('/chompy/', function(err, files) {
	if (err) {
		return console.error(err);
	}
	files.forEach( function (file) {
		console.log(file);
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




