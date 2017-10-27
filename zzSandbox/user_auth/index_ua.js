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

router.get('/login', function(req, res) {
	var username = "named_user";
	var password = "pass0word!";
});

router.post('/loginpost', function(req, res) {
	//console.log('Total Page Loads After Posting Login Form Page: ', pg_load);
	// query against user_acct table
	// check if true or false
	// pass forward true or false results to dummy page for now so I don't have to manipulate home page.
	db.run("SELECT * FROM user_acct WHERE username = \"" + req.body["username"] + "\" AND password = \"" + req.body["password"] + "\"", function (err, rows) {
		var user_auth;
		if (rows.length == 0) {
			user_auth = false;
		} else {
			user_auth = true;
		};
		//res.redirect('/login?user_auth=' + user_auth);
		console.log(user_auth);
		//res.redirect('logged_in?user_auth=' + user_auth);
		// i could pass data forward w/ res.redirect and a query string that passes user_auth variable.
	});
});


app.listen(3000, function() {
	console.log('index_ua.js listening on port 3000!');
});


