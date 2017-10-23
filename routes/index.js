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


