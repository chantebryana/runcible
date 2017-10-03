// pseudocode cleaning up / digesting what's in blackboard3_cookies.js after Jim's ongoing discussions about cookies and callbacks: 

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

function check_browser_cookie(callback){
	// save browser's cookie to browser_cookie_key via req.cookies:
	var browser_cookie_key = req.cookies;
	// access db table to verify whether browser_cookie_key matches any entries: 
	db.run_smart("SELECT session_data FROM cookie_key_json WHERE cookie_key = \"" + browser_cookie_key.cookie_key + "\"", function(err, rows) {
		// if query returns no results (ie, no browser cookie or browser cookie doesn't match any table entries): 
		if (rows.length == 0) {
			// call helper functions that will create new id, create new db table entry, and save new id to browser cookie cache. afterwards, declare callback with new_cookie_key to pass value forward to future functions: 
			create_and_save_cookie_id(res, function(new_cookie_key) {
				callback(new_cookie_key);
			});
		};
		// pass browser_cookie_key forward to future functions:
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

// CE: incomplete and/or incorrect: 
function insert_new_id_to_db_table(new_cookie_key, res, save_new_cookie_id_to_browser){
	// insert new secret cookie id into db table: create new entry with a page_count value of 1 (b/c I've loaded the page 1 time to even make this cookie key):
	db.run_smart("INSERT INTO cookie_key_json (cookie_key, session_data) VALUES (\"" + new_cookie_key + "\", '{\"page_count\":1}')", function(err, rows) { /* JE: put code that I want to run AFTER this INSERT query within this anonymous callback function: this makes sure that clashing queries don't happen at the same time / out of order. */	
		save_new_cookie_id_to_browser(res, new_cookie_key);
	});
}

function save_new_cookie_id_to_browser(res, new_cookie_key){
	// exactly what the function name suggests: use res.setHeader to save newly-created cookie to browser's cache:
	res.setHeader('Set-Cookie', cookie.serialize('cookie_key', new_cookie_key));
}

function create_and_save_cookie_id(res, callback) {
	var secret_cookie_id = make_id();
	insert_new_id_to_db_table(secret_cookie_id, function(){
		save_new_cookie_id_to_browser(res, new_cookie_id);
	});
}


router.get('/', function(req, res){

});


app.listen(3000, function() {
	console.log('Blackboard4_cookies.js listening on port 3000!');
});
