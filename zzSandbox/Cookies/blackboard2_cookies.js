// https://expressjs.com/en/starter/hello-world.html
// https://scotch.io/tutorials/use-ejs-to-template-your-node-application

var express = require('express');
var path = require('path'); // makes app.use(express.static ... work down below

var cookieParser = require('cookie-parser');
var cookie = require('cookie');  // https://www.npmjs.com/package/cookie
var cookie_var = ""; // CE: temporary cookie variable
var bodyParser = require('body-parser');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public'))); // accesses public directory

var router = app;//express.Router();
app.set('view engine', 'ejs');  // line 16 of app.js in Lionheart

// global variables to open and access database
var sqlite3 = require('sqlite3').verbose();
var file = 'fam_beta.db';
var db = new sqlite3.Database(file);



router.get('/', function(req, res){
	var browser_secret_cookie = "bbb222";
	db.all("SELECT page_loads FROM cookie_key_test WHERE cookie_key= \"" + browser_secret_cookie + "\"", function(err, rows_from_select) {
		var pg_load = rows_from_select[0].page_loads;
		pg_load += 1;
		db.all("UPDATE cookie_key_test SET page_loads=" + pg_load + "WHERE cookie_key=\"" + browser_secret_cookie + "\"", function(err, rows_from_update) {
			//console.log(rows_from_update); // don't twerk b/c UPDATE query doesn't return anything. duh.
			console.log("update portion ran"); // that worked.
			// server error with res.render portion:
			//res.render( {
				//pg_load_to_renderer: pg_load
			//});
		});
	});
});

app.listen(3000, function() {
	console.log('Example app listening on port 3000!');
});







