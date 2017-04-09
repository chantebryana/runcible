// https://expressjs.com/en/starter/hello-world.html

var express = require('express');
var app = express();
app.set('view engine', 'ejs');  // line 16 of app.js in Lionheart

app.get('/', function(req, res) {
	//res.send('Hello World!');
	res.render('pages/hello_world.ejs', {title: 'Hello World'});
});

app.listen(3000, function() {
	console.log('Example app listening on port 3000!');
});

