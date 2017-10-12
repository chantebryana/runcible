// https://www.tutorialspoint.com/nodejs/nodejs_file_system.htm

var fs = require("fs");

// Asynchronous read
fs.readFile('input.txt', function (err, data) {
  if (err) {
    return console.error('<<<>>>', err);
  }
  console.log("Asynchronous read: " + data.toString());
});

console.log('Program ended');
