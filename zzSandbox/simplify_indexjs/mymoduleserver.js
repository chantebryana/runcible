// // https://www.w3schools.com/nodejs/nodejs_modules.asp
// https://www.w3schools.com/nodejs/nodejs_filesystem.asp
// CE: includes some personal adaptations as I try to merge the ideas of fs and eval together!
var http = require('http');
var dt = require('./myfirstmodule');
var fs = require('fs');
// synchronous fs: 
var data = fs.readFileSync('demofile1.html');

http.createServer(function(req,res) {
	res.writeHead(200, {'Content-Type': 'text/html'});
	res.write(eval('data'));
	res.write('The date and time are currently: ' + dt.myDateTime());
	res.end();
}).listen(8080);


