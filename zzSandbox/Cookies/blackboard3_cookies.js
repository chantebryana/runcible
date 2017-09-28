// pseudocode for checking if browser has cookie, verifying it against the db table, and possibly generating a new cookie (and assigning to db table if needed). I'm packing too much in my desired to-dos: I should simplify. For now, perhaps focusing on whether the browser even has a cookie.


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
// JE: can't return this.all (to then grab and access the return value of callback(err,rows) ) because callback(err,rows) returns to a different bucket than db.all has access to --> it can't return from a bucket that's out of reach:
  return this.all(query_string, function(err, rows){
    if(err) {
      console.log(err);
    } else {
//var pg_load = callback(err, rows);
return callback(err, rows);
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

function check_browser_cookie(callback) {
	// save browser's cookie to browser_cookie_key via req.cookies:
	var browser_cookie_key = req.cookies;
	// access db table to verify whether browser_cookie_key matches any entries: 
	db.run_smart("SELECT session_data FROM cookie_key_json WHERE cookie_key = \"" + browser_cookie_key.cookie_key + "\"", function(err, rows) {
		// section below: 
		//var db_check = 1;
		if (rows.length == 0) {
			//db_check = 0;
			// browser_cookie_key = make_id() // CE: will this work? 
			// tell_browser_server()
			// call create_and_save_cookie_id, which calls some helper functions which will A) create a new alpha-numeric 6-character string; B) create new db table for new cookie id and 1 page load; and C) save secret cookie key to browser's cookie cache:
			create_and_save_cookie_id();
		}
		//callback(db_check);
		// pass forward browser_cookie_key, regardless of whether it was accessed from an existing cookie on the browser or whether it had to be generated within this function workflow:
		callback(browser_cookie_key);
	});
}

function make_id() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 6; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
	};
  return text;
}

function insert_new_id_to_db_table(secret_id) {
	// insert new secret cookie id into db table: create new entry with a page_count value of 1 (b/c I've loaded the page 1 time to even make this cookie key):
	db.run_smart("INSERT INTO cookie_key_json (cookie_key, session_data) VALUES (\"" + secret_id + "\", '{\"page_count\":1}')", function(err, rows) {	});
}

function save_new_cookie_id_to_browser(secret_id) {
	// exactly what the function name suggests: use res.setHeader to save newly-created cookie to browser's cache:
	res.setHeader('Set-Cookie', cookie.serialize('cookie_key', secret_id));
}

function create_and_save_cookie_id() {
	var secret_cookie_id = make_id();
	insert_new_id_to_db_table(secret_cookie_id);
	save_new_cookie_id_to_browser(secret_cookie_id);
};

function increment_pg_load(secret_cookie, callback) {
	// based on secret browser key, look up appropriate row from cookie_key_json db table using Jim's db.run_smart instead of db.all:
	db.run_smart("SELECT session_data FROM cookie_key_json WHERE cookie_key = \"" + secret_cookie + "\"", function(err, rows_from_select) {
		// parse out JSON-style data that db returned:
		var parsed_rows = JSON.parse(rows_from_select[0].session_data);
		// save page_count portion of parsed data to its own variable:
		var pg_load = parsed_rows.page_count;
		// increment pg_load by 1 (because page loaded or refreshed to get to this portion of code):
		pg_load += 1;
		// update page_count portion of parsed_rows to equal the value of the incremented pg_load variable:
		parsed_rows.page_count = pg_load;
		// turn updated parsed_rows variable back to a JSON-style string:
		var stringed_row = JSON.stringify(parsed_rows);
		// update cookie_key_json table to reflect incremented page count data:
		db.run_smart("UPDATE cookie_key_json SET session_data = '" + stringed_row + "' WHERE cookie_key = \"" + secret_cookie + "\"", function(err, rows_from_update) {

			callback(pg_load);
		});
	});
};

router.get('/', function(req, res){
	// pretend authenticated browser cookie key (temporary):
	var browser_secret_cookie = "aaa111";
	// or actual code to access browser's cookie: 
	// verify_browser_cookie() { }
	increment_pg_load(browser_secret_cookie, function(pg_load){

		//...//

		res.render('pages', {
			//...//
			pg_load_to_renderer: pg_load;
			//...//
		});
	});
});


app.listen(3000, function() {
	console.log('Blackboard3_cookies.js listening on port 3000!');
});

