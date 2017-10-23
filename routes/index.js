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
require('/home/ruby/Projects/runcible/routes/helper_func/run_smart');
require('/home/ruby/Projects/runcible/routes/helper_func/cookie_pg_load_helpers');
require('/home/ruby/Projects/runcible/routes/helper_func/get_pg_load');
require('/home/ruby/Projects/runcible/routes/helper_func/post_pg_load');
require('/home/ruby/Projects/runcible/routes/helper_func/id_date_range_helpers');
require('/home/ruby/Projects/runcible/routes/helper_func/x-y_axis_helpers');

// require URL handlers: 
require('/home/ruby/Projects/runcible/routes/URL_handlers/home_pg');
require('/home/ruby/Projects/runcible/routes/URL_handlers/form');
require('/home/ruby/Projects/runcible/routes/URL_handlers/form_update');
require('/home/ruby/Projects/runcible/routes/URL_handlers/form_post');
require('/home/ruby/Projects/runcible/routes/URL_handlers/form_post_update');
require('/home/ruby/Projects/runcible/routes/URL_handlers/delete_post');

// temporary URL handlers: 
//require('/home/ruby/Projects/runcible/routes/URL_handlers/cookie');
require('/home/ruby/Projects/runcible/routes/URL_handlers/clear_cookie');


app.listen(3000, function() {
	console.log('index.js listening on port 3000!');
});


