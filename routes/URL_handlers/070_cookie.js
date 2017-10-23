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
