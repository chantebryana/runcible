// // https://www.w3schools.com/nodejs/nodejs_modules.asp
// https://www.w3schools.com/nodejs/nodejs_filesystem.asp
var http = require('http');
var dt = require('./myfirstmodule');
var fs = require('fs');

/*
http.createServer(function(req,res) {
	fs.readFile('demofile1.html', function(err, data) {
		res.writeHead(200, {'Content-Type': 'text/html'});
		res.write(data);
		//res.write('The date and time are currently: ' + dt.myDateTime());
		res.end();
	});
}).listen(8080);
*/

// https://stackoverflow.com/questions/10058814/get-data-from-fs-readfile
function readContent(callback) {
	fs.readFile('./demofile1.html', function(err, content) {
		if (err) return callback(err)
		callback(null, content);
	})
}

readContent(function (err, content) {
	console.log(content);
})

// printout on terminal: 
// ruby@rubyVM:~/Projects/runcible$ node ./zzSandbox/simplify_indexjs/mymoduleserver.js 
// undefined

