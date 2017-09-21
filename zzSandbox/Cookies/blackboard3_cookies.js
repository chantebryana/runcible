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

router.get('/', function(req, res){
	// check browser for cookie
	var browser_cookie_temp = req.cookies;
	console.log("browser_cookie_temp: ", browser_cookie_temp);
	var browser_cookie_key = "aaa111";

	// check db to see if browser_cookie_key matches any entries there:
	db.run_smart("SELECT session_data FROM cookie_key_json WHERE cookie_key = \"" + browser_cookie_key + "\"", function(err, rows) {
		// if cookie doesn't match any db table entries, for now, print to console a message saying so:
		if (rows.length == 0) {
			console.log("rows.length == 0: no match");
		// if cookie does match a db table entry, for now, print to console a message saying so:
		} else { // if (rows.length != 0)
			console.log("there's a match!");
			console.log(rows);
		}
	});

});


app.listen(3000, function() {
	console.log('Blackboard3_cookies.js listening on port 3000!');
});

