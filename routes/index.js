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
// in this case, __dirname returns: /home/ruby/Projects/runcible/routes
app.use(express.static(path.join(__dirname, '../public'))); // accesses public directory

router = app;//express.Router();
app.set('view engine', 'ejs');  // line 16 of app.js in Lionheart

// global variables to open and access database
sqlite3 = require('sqlite3').verbose();
file = 'fam_beta.db';
db = new sqlite3.Database(file);


// CE: all the requires, now in concentrate!
// synchronously access file system using fs (results saved to an array), then require all of the .js files that were pulled up:
dir_helper_func = fs.readdirSync(__dirname + '/helper_func');
dir_url_handlers = fs.readdirSync(__dirname + '/URL_handlers');
for (var i = 0; i < dir_helper_func.length; i++) {
	if (dir_helper_func[i].slice(-3) == '.js') {
		require('./helper_func/' + dir_helper_func[i]);
	}
};
for (var i = 0; i < dir_url_handlers.length; i++) {
	if (dir_url_handlers[i].slice(-3) == '.js') {
		require('./URL_handlers/' + dir_url_handlers[i]);
	}
};


app.listen(3000, function() {
	console.log('index.js listening on port 3000!');
});


