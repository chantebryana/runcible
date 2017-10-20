// https://expressjs.com/en/starter/hello-world.html
// https://scotch.io/tutorials/use-ejs-to-template-your-node-application

express = require('express');
path = require('path'); // makes app.use(express.static ... work down below

cookieParser = require('cookie-parser');
cookie = require('cookie');  // https://www.npmjs.com/package/cookie
cookie_var = ""; // CE: temporary cookie variable
bodyParser = require('body-parser');

app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public'))); // accesses public directory

router = app;//express.Router();
app.set('view engine', 'ejs');  // line 16 of app.js in Lionheart

// global variables to open and access database
sqlite3 = require('sqlite3').verbose();
file = 'fam_beta.db';
db = new sqlite3.Database(file);

//
//
//
//
//CE: all the requires!
require('/home/ruby/Projects/runcible/routes/helper_func/run_smart');
require('/home/ruby/Projects/runcible/routes/helper_func/cookie_pg_load_helpers');
require('/home/ruby/Projects/runcible/routes/helper_func/get_pg_load');
require('/home/ruby/Projects/runcible/routes/helper_func/post_pg_load');
require('/home/ruby/Projects/runcible/routes/helper_func/id_date_range_helpers');
require('/home/ruby/Projects/runcible/routes/helper_func/x-y_axis_helpers');


require('/home/ruby/Projects/runcible/routes/URL_handlers/form');
require('/home/ruby/Projects/runcible/routes/URL_handlers/form_update');
require('/home/ruby/Projects/runcible/routes/URL_handlers/home_pg');
require('/home/ruby/Projects/runcible/routes/URL_handlers/form_post');
require('/home/ruby/Projects/runcible/routes/URL_handlers/delete_post');
require('/home/ruby/Projects/runcible/routes/URL_handlers/form_post_update');




router.get('/cookie', function(req,res){
	// sets the initial cookie by hand for testing purposes: 
	res.setHeader('Set-Cookie', cookie.serialize('cookie_key', 'aaa111'));
	// save browser's cookie to browser_cookie_key via req.cookies:
	var browser_cookie_key = req.cookies;
	console.log("browser_cookie_key: ", browser_cookie_key);
	// access db table to verify whether browser_cookie_key.cookie_key matches any entries:
	db.run_smart("SELECT session_data FROM cookie_key_json WHERE cookie_key = \"" + browser_cookie_key.cookie_key + "\"", function(err, rows) {
		console.log("rows: ", rows);
		// if cookie doesn't match any db table entries, for now, print to console a message saying so:
		if (rows.length == 0) {
			console.log("rows.length == 0: no match");
		// if cookie does match a db table entry, for now, print to console a message saying so:
		} else { // if (rows.length != 0)
			console.log("there's a match!");
			console.log(rows);
		}
	});
	res.send('Cookie\'s sent!');
});

router.get('/clearcookie', function(req,res){
	// remove page_loads cookie from browser cache (and subsequently from the server's attempts to access browser's cache): 
	res.clearCookie('cookie_key');
	// send a message to the web page to let the user know something happened: 
	res.send('Cookie deleted');
});

app.listen(3000, function() {
	console.log('index.js listening on port 3000!');
});


