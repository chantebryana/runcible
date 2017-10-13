// // https://www.w3schools.com/nodejs/nodejs_modules.asp
// https://www.w3schools.com/nodejs/nodejs_filesystem.asp
// CE: includes some personal adaptations as I try to merge the ideas of fs and eval together!
var http = require('http');
var dt = require('./myfirstmodule');
var fs = require('fs');

http.createServer(function(req,res) {
	fs.readFile('demofile1.html', function(err, data) {
		res.writeHead(200, {'Content-Type': 'text/html'});
		res.write(eval('data'));
		res.write('The date and time are currently: ' + dt.myDateTime());
		res.end();
	});
}).listen(8080);

