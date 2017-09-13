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

/*
CREATE TABLE cookie_key_json (
	id integer PRIMARY KEY,
	cookie_key text,
	session_data text
);
*/

router.get('/', function(req, res){
	// CE PLAYING W/ COOKIES!!
	var browser_secret_cookie = "bbb222";
	db.all("SELECT session_data FROM cookie_key_json WHERE cookie_key = \"" + browser_secret_cookie + "\"", function(err, rows_from_select) {
		if (err) {
			console.log(err);
		};
		console.log(rows_from_select); // returns [ { session_data: '{"page_count" : 222}' } ]
		var parsed_rows = JSON.parse(rows_from_select[0].session_data);
		console.log(parsed_rows); // returns { page_count: 222 }
		var pg_load = parsed_rows.page_count;
		console.log(pg_load); // returns 222
		pg_load += 1;
		parsed_rows.page_count = pg_load;
		console.log(parsed_rows); // returns { page_count: 223 }
		var stringed_row = JSON.stringify(parsed_rows);
		console.log(stringed_row); // returns {"page_count":223}
		var re_assembled_row = [{"session_data": '' + stringed_row + ''}] 
		console.log(re_assembled_row); // returns [ { session_data: '{"page_count":223}' } ]

		// db.all("UPDATE cookie_key_json SET session_data = \"" + re_assembled_row + "\" WHERE cookie_key = \"" + browser_secret_cookie + "\"", function(err, rows_from_update) {
		//db.all("UPDATE cookie_key_json SET session_data = '{\"page_count\" : 223}' WHERE cookie_key = \"" + browser_secret_cookie + "\"", function(err, rows_from_update) {
		var weird_quotes = '"zword"';
		db.all("UPDATE cookie_key_json SET cookie_key = \"" + weird_quotes + "\" WHERE id = 3", function(err, rows_from_update) {
			if (err) {
				console.log(err);
			};
			console.log("Successfully performed UPLOAD");
		});
/*
		pg_load += 1;
		rows_from_select[0].page_loads = pg_load;
		db.all("UPDATE cookie_key_json SET page_loads=" + pg_load + " WHERE cookie_key=\"" + browser_secret_cookie + "\"", function(err, rows_from_update) {
			// console.log(err);
		});
*/
	});
});

app.listen(3000, function() {
	console.log('Example app listening on port 3000!');
});







