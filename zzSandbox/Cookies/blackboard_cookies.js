var dict1 = {'key1':{'vkey1': 'vvalue1', 'vkey2': 'vvalue2', 'vkey3': 'vvalue3'}};

var dict2 = {'key1': {'vkey1':'vvalue1', 'vkey2':'vvalue2', 'vkey3':'vvalue3'}, 'key2':'value2'};

hp:firefox				->	session key: 'UUID2300'
hp:chrome					-> 	session key: 'UUID2400'
moto:firefos			->	session key: 'UUID2500'
library:explorer	->	session key: 'UUID2600'

//	//	//	//
/*
COOKIE_TABLE
	ID | COOKIE_KEY | SESSION_DATA
	-------------------------------------------------------
	00 | 'abc123'		| '{"page_loads":00, "key":"value"}'
*/

// pseudocode for parsing and manipulating session data (page loads), assuming that the cookie key received from the browser is legit (as per discussion w/ Jim 2017-09-11):
db.all("SELECT session_data FROM cookie_table WHERE cookie_key =\"" + browser_secret_cookie + "\"", function(err, rows){ // rows variable should be a long string
	// parsing long JSON string and saving to pg_load variable:
	var pg_load = JSON.parse(rows[0]);
	// increment pg_load by 1, since presumably I've loaded or refreshed a page to get to this portion of code:
	pg_load += 1;
	
});


// how would I do this w/o JSON, but rather with more structured db rows?
/*
COOKIE_TABLE
	ID | SESSION_ID | PAGE_LOADS
	-------------------------------
	00 | 'abc123'		| 00
*/

db.all("SELECT page_loads FROM cookie_table WHERE session_id =\"" + browser_secret_cookie + "\"", function(err, rows) {
	// rows == [{page_loads:00}] 
	var pg_load = rows[0].page_loads; // should be 00: raw intiger
	pg_load += 1;
	db.all("UPDATE cookie_table SET page_loads=" + pg_load + "WHERE session_id=\"" + browser_secret_cookie + "\"", function(err, rows_from_update) {
		res.render( {
			pg_load_to_renderer: pg_load
		});
	});
});

// --	--	---

// I feel like I should test this idea out. I suppose I could create a dummy db table, load it with a couple rows of dummy data, then access and manipulate it using my precursor to real workflow pseudocode, and attempt to iron out the kinks. Sounds good to me.
