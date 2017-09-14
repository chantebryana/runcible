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
// Jim's homemade error-checking function that replaces db.all:
db.run_smart = function run_smart(query_string, callback){
  this.all(query_string, function(err, rows){
    if(err) {
      console.log(err);
    } else {
	    callback(err, rows);
		}
  });
}

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
		//console.log(rows_from_select); // returns [ { session_data: '{"page_count" : 222}' } ]
		var parsed_rows = JSON.parse(rows_from_select[0].session_data);
		//console.log(parsed_rows); // returns { page_count: 222 }
		var pg_load = parsed_rows.page_count;
		//console.log(pg_load); // returns 222
		pg_load += 1;
		parsed_rows.page_count = pg_load;
		//console.log(parsed_rows); // returns { page_count: 223 }
		var stringed_row = JSON.stringify(parsed_rows);
		//console.log(stringed_row); // returns {"page_count":223}
		// CE don't need re_assembled_row: remember that sqlite table data doesn't look the same as how node js express prints it out on the console after a query: js adds the key (column header) to the value within the object it creates. when I'm updating a db table, i just need the value not the key. blah blah.:
		// var re_assembled_row = [{"session_data": '' + stringed_row + ''}] 
		// console.log(re_assembled_row); // returns [ { session_data: '{"page_count":223}' } ]
		
		var query = "";
		db.run_smart(query="UPDATE cookie_key_json SET session_data = '" + stringed_row + "' WHERE cookie_key = \"" + browser_secret_cookie + "\"", function(err, rows_from_update) {
/*
		console.log(query);
			if (err) {
				console.log(err);
			};
*/
			console.log("Successfully performed UPLOAD");
		});
	});
});

app.listen(3000, function() {
	console.log('Example app listening on port 3000!');
});







