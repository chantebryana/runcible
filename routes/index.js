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
app.use(express.static(path.join(__dirname, '../public'))); // accesses public directory; here's some info on __dirname variable: https://stackoverflow.com/questions/8131344/what-is-the-difference-between-dirname-and-in-node-js

router = app;//express.Router();
app.set('view engine', 'ejs');  // line 16 of app.js in Lionheart

// global variables to open and access database
sqlite3 = require('sqlite3').verbose();
file = 'fam_beta.db';
db = new sqlite3.Database(file);


//CE: all the requires, now in concentrate!

// synchronously access files in two directories, plus prep a couple of empty arrays for the requires in the next two for loops: 
dir_helper_func = fs.readdirSync(__dirname + '/helper_func');
dir_url_handlers = fs.readdirSync(__dirname + '/URL_handlers');
js_helper_func = [];
js_url_handlers = [];

// next 2 for loops: access file system using fs, push .js files into an array, then require them all:
count = 0;
for (var i = 0; i < dir_helper_func.length; i++) {
	if (dir_helper_func[i].slice(-3) == '.js') {
		count ++;
		js_helper_func[count] = dir_helper_func[i];
		require(__dirname + '/helper_func/' + js_helper_func[count]);
	}
};

count = 0; // reset count to 0
for (var i = 0; i < dir_url_handlers.length; i++) {
	if (dir_url_handlers[i].slice(-3) == '.js') {
		count ++;
		js_url_handlers[count] = dir_url_handlers[i];
		require(__dirname + '/URL_handlers/' + js_url_handlers[count]);
	}
};


app.listen(3000, function() {
	console.log('index.js listening on port 3000!');
});


