// https://expressjs.com/en/starter/hello-world.html
// https://scotch.io/tutorials/use-ejs-to-template-your-node-application

express = require('express');
path = require('path'); // makes app.use(express.static ... work down below

cookieParser = require('cookie-parser');
cookie = require('cookie');  // https://www.npmjs.com/package/cookie
cookie_var = ""; // CE: temporary cookie variable
bodyParser = require('body-parser');
fs = require('fs'); // CE: set this up for file system access (use for all the requires below)

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

dir_helper_func = fs.readdirSync('/home/ruby/Projects/runcible/routes/helper_func');
dir_url_handlers = fs.readdirSync('/home/ruby/Projects/runcible/routes/URL_handlers');
js_helper_func = [];
js_url_handlers = [];

for (var i = 0; i < dir_helper_func.length; i++) {
	if (dir_helper_func[i].slice(-3) == '.js') {
		js_helper_func.push(dir_helper_func[i]);
	}
};

for (var i = 0; i < dir_url_handlers.length; i++) {
	if (dir_url_handlers[i].slice(-3) == '.js') {
		js_url_handlers.push(dir_url_handlers[i]);
	}
};

// print elements of js_helper_func and js_url_handlers arrays to ensure that everything's working: 
console.log('\njs_helper_func files: ');
for (var i = 0; i < js_helper_func.length; i++) {
	console.log('/home/ruby/Projects/runcible/routes/helper_func/' + js_helper_func[i]);
};
console.log('\njs_url_handlers files: ');
for (var i = 0; i < js_url_handlers.length; i++) {
	console.log('/home/ruby/Projects/runcible/routes/URL_handlers/' + js_url_handlers[i]);
};

//CE: all the requires!
// require helper functions: 
require('/home/ruby/Projects/runcible/routes/helper_func/010_run_smart');
require('/home/ruby/Projects/runcible/routes/helper_func/020_cookie_pg_load_helpers');
require('/home/ruby/Projects/runcible/routes/helper_func/030_get_pg_load');
require('/home/ruby/Projects/runcible/routes/helper_func/040_post_pg_load');
require('/home/ruby/Projects/runcible/routes/helper_func/050_id_date_range_helpers');
require('/home/ruby/Projects/runcible/routes/helper_func/060_x-y_axis_helpers');

// require URL handlers: 
require('/home/ruby/Projects/runcible/routes/URL_handlers/010_home_pg');
require('/home/ruby/Projects/runcible/routes/URL_handlers/020_form');
require('/home/ruby/Projects/runcible/routes/URL_handlers/030_form_update');
require('/home/ruby/Projects/runcible/routes/URL_handlers/040_form_post');
require('/home/ruby/Projects/runcible/routes/URL_handlers/050_form_post_update');
require('/home/ruby/Projects/runcible/routes/URL_handlers/060_delete_post');

// temporary URL handlers: 
require('/home/ruby/Projects/runcible/routes/URL_handlers/070_cookie');
require('/home/ruby/Projects/runcible/routes/URL_handlers/080_clear_cookie');


app.listen(3000, function() {
	console.log('index.js listening on port 3000!');
});


