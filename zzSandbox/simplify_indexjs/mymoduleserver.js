// // https://www.w3schools.com/nodejs/nodejs_modules.asp
// https://www.w3schools.com/nodejs/nodejs_filesystem.asp
// CE: includes some personal adaptations as I try to merge the ideas of fs and eval together!
var http = require('http');
var dt = require('./myfirstmodule');
var fs = require('fs');
// synchronous fs read file: 
var data = fs.readFileSync('demofile1.html');

// synchronous fs read directory (using tools discovered / played with in zzSandbox/simplify_indexjs/main.js): 
// CE: it would be nice to only extract the .html files from the directory, and then push them into an array variable (maybe like data[0] and data[1] and so on), but I can't find the help text to make that work.
var dir = fs.readdirSync('/home/ruby/Projects/runcible/zzSandbox/simplify_indexjs');
console.log('synchronously read directory: ');
for (var i = 0; i < dir.length; i++) {
	console.log(dir[i], ' ');
};

http.createServer(function(req,res) {
	res.writeHead(200, {'Content-Type': 'text/html'});
	res.write(eval('data'));
	res.write('The date and time are currently: ' + dt.myDateTime());
	res.end();
}).listen(8080);


