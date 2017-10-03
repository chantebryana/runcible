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
			// JE: (17:00 of '20171002 Jim cookies and callbacks 02.amr'): create_and_save_cookie_id contains another layer of asynchronisity (first layer was db.run_smart), and it must have its own callback or else it'll get lost forever. there's no way to get back: this line executes but returns without a desitnation unless it has its own callback.
			create_and_save_cookie_id(

			);
// 1 - pass the callback through
			create_and_save_cookie_id(res, callback/*() - don't call it here!*/);
// 2 - regain "program flow" and handle the callback here
			create_and_save_cookie_id(res, function(new_cookie_key){
				//browser_cookie_key = new_cookie_key;
				// JE (25:00 of second audio file) ... anything else "check_browser_cookie()" needs to do before "calling forward" is done here ...
				callback(new_cookie_key);
			});
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

function insert_new_id_to_db_table(secret_id, callback) {
	// insert new secret cookie id into db table: create new entry with a page_count value of 1 (b/c I've loaded the page 1 time to even make this cookie key):
	db.run_smart("INSERT INTO cookie_key_json (cookie_key, session_data) VALUES (\"" + secret_id + "\", '{\"page_count\":1}')", function(err, rows) { /* JE: put code that I want to run AFTER this INSERT query within this anonymous callback function: this makes sure that clashing queries don't happen at the same time / out of order. */	
		callback(); // CE/JE: this line isn't necessarily just garbage code: inserted via coaxing from Jim to try to fit insert_new_id_to_db_table into wider call-forward machinery (minute 4 of '20171002 Jim cookies and callbacks 02.amr') --> no need to pass secret_id variable into arguments list of callback (redundant or something -- already part of name space I guess...). this callback comes from the one within 'if' statement of check_browser_cookie (within create_and_save_cookie_id)
	});
}

// JE: this function needs to have `res` object passed through it:
function save_new_cookie_id_to_browser(res, secret_id) {
	// exactly what the function name suggests: use res.setHeader to save newly-created cookie to browser's cache:
	res.setHeader('Set-Cookie', cookie.serialize('cookie_key', secret_id));
}

function create_and_save_cookie_id(/*arguments missing...*/) {
	var secret_cookie_id = make_id(); // JE: this gets assigned synchronously: no worries about secret_cookie_id not getting assigned before next two functions run
	insert_new_id_to_db_table(secret_cookie_id, function(){
		save_new_cookie_id_to_browser(/*argument,*/ secret_cookie_id); // JE: I could put this function BEFORE insert_new_id_to_db_table, OR I can place it within the anonymous callback function, which is more standard for javascript/nodejs and is what I'm doing here. (minute 9 of '20171002 Jim cookies and callbacks 02.amr')
// JE follow-up line for option 1 in check_browser_cookie:
		callback(secret_cookie_id);
	}); // JE: make sure that this is all the way complete before anything else needs to access db table: don't want to update page_count variable before this INSERT query is finalized; need to find a way to halt future actions until this one is finished. also consider functionality in multi-user use cases (ie, real world). (or other unusual use cases like hitting refresh really fast).
	//save_new_cookie_id_to_browser(secret_cookie_id); // JE: synchronous action, not asynchronous. res.setHeader changes internal data structure that will be part of res.render later (or, as for the case of router.get('/cookie'...), res.send -- same action).
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

