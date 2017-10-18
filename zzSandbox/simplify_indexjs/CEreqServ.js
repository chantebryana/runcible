http = require('http');
//dt = require('./myfirstmodule');
require('./myfirstmodule');

http.createServer(function(req,res) {
	res.writeHead(200, {'Content-Type': 'text/html'});
	res.write('Hello World!');
	res.write(myDateTime);
	//res.write(dt); // CE with line 2: error. JE: doesn't work b/c dt is undefined b/c there's no module.exports in included file
	//res.write(require('./myfirstmodule')); // CE error
	//res.write(Date()); // CE this worked
	res.end();
}).listen(8080);
console.log('cool');

