// https://www.tutorialspoint.com/nodejs/nodejs_file_system.htm

var fs = require("fs");

// Asynchronous read
fs.readFile('./zzSandbox/simplify_indexjs/input.txt', function (err, data) {
  if (err) {
    return console.error('<<<>>>', err);
  }
  console.log("Asynchronous read: " + data.toString());
});

// Synchronous read
var data = fs.readFileSync('./zzSandbox/simplify_indexjs/input.txt');
console.log("Synchronous read: " + data.toString());

console.log('Program ended');
