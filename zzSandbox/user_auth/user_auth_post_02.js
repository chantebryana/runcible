// let's clean things up a little while keeping the old file for reference...

// let's pretend that the db query on the original URL handler returned the following: 
rows.length == 0; // or something to the similar effect: no cookie key, no user_auth

// let's pretend that my user's login attempt was successful
successful_login = true; // or something to the similar effect

// this function contains: make_id(), insert_new_id_to_db_table(), and save_new_cookie_id_to_browser(); also contains pseudocode function in user_auth_post_01.js:
create_and_save_cookie_id(res, function (new_cookie_key) {
	set_user_auth_to_true(function(parsed_rows) {
		callback(new_cookie_key, parsed_rows); // CE: I'm pretty sure this syntax is allowed, but do I need the browser_cookie_key on steps moving forwards??
	});
});

