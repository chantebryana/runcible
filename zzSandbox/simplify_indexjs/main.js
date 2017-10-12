// https://www.tutorialspoint.com/nodejs/nodejs_file_system.htm

var fs = require("fs");

// Asynchronous read
fs.readFile('./input.txt', function (err, data) {
  if (err) {
    return console.error('<<<>>>', err);
  }
  console.log("Asynchronous read: " + data.toString());
});

// Synchronous read
var data = fs.readFileSync('./input.txt');
console.log("Synchronous read: " + data.toString());

console.log('Program ended');



// relative path notes w/ Jim:

// example from app.js in lionheart: (line 25)
app.use('/favicon.ico', express.static(path.join(__dirname, 'public', 'favicon.ico')));

//1:
app.use // for this URL '/favicon.ico' ...
//2:
express.static // ... use this file named here ot satisfy a URL request '/favicon.ico'
//3:
path.join // knows how to concatenate strings wihtin (): 
//4:
__dirname // gives the absolute path (__dirname) to the present working directory


//pwd (present working directory; current working directory): 
//1: ***at in node or invoke sciprt***
//2: where the script is at
//3: root (not a relative path, but an absolute path starting at root directory)



