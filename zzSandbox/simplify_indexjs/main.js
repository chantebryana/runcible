// https://www.tutorialspoint.com/nodejs/nodejs_file_system.htm

var fs = require("fs");

// remove a directory 'test'
console.log("Going to delete directory /tmp/test");
fs.rmdir("/tmp/test",function(err){
  if (err) {
    return console.error(err);
  }
  console.log("Going to read directory /tmp");
   
  fs.readdir("/tmp/",function(err, files){
    if (err) {
      return console.error(err);
    }
    files.forEach( function (file){
      console.log( file );
    });
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




