// 6 new global functions: CE PLAYING WITH COOKIES:
function check_browser_cookie(req, res, callback){
	// save browser's cookie to browser_cookie_key via req.cookies:
	var browser_cookie_key = req.cookies;
	// access db table to verify whether browser_cookie_key matches any entries: 
	// JE: MUST FIX: sql injection attack:
	db.run_smart("SELECT session_data FROM cookie_key_json WHERE cookie_key = \"" + browser_cookie_key.cookie_key + "\"", function(err, rows) {
		// if query returns no results (ie, no browser cookie or browser cookie doesn't match any table entries): 
		if (rows.length == 0) {
			// call helper functions that will create new id, create new db table entry, and save new id to browser cookie cache. afterwards, declare callback with new_cookie_key to pass value forward to future functions: 
			create_and_save_cookie_id(res, function(new_cookie_key) {
				// passes newly-generated cookie key string forward to future functions:
				callback(new_cookie_key);
			});
		} else {
			// pass browser_cookie_key string forward to future functions:
			callback(browser_cookie_key.cookie_key);
		}
	});
}

function make_id() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 6; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
	};
  return text;
}
 
function insert_new_id_to_db_table(new_cookie_key, callback){
	// insert new secret cookie id into db table: create new entry with a page_count value of 0 (this value will increment up to 1 in increment_pg_load function):
	//JE: no sql injection attack risk b/c query is based off of just-made new cookie key:
	db.run_smart("INSERT INTO cookie_key_json (cookie_key, session_data) VALUES (\"" + new_cookie_key + "\", '{\"page_count\":0}')", function(err, rows) { 
		// since this was asynchronous, declare callback to direct traffic back to the calling function (rather than getting lost in space):	
		callback(); 
	});
}

function save_new_cookie_id_to_browser(res, new_cookie_key){
	// exactly what the function name suggests: use res.setHeader to save newly-created cookie to browser's cache:
	res.setHeader('Set-Cookie', cookie.serialize('cookie_key', new_cookie_key));
}

// create a new cookie key, save it to db table and save to browser's cookie cache; finish by declaring callback (which effectively passes secret_cookie_id forward to next function): 
function create_and_save_cookie_id(res, callback) {
	var secret_cookie_id = make_id();
	insert_new_id_to_db_table(secret_cookie_id, function(){
		save_new_cookie_id_to_browser(res, secret_cookie_id);
		callback(secret_cookie_id);
	});
}

// access pg load data from db table, increment it by 1, then push to relevant locations (update server and web page renderer): 
function increment_pg_load(browser_cookie_key, callback) {
	// based on secret browser key, look up appropriate row from cookie_key_json db table using Jim's db.run_smart instead of db.all:
	db.run_smart("SELECT session_data FROM cookie_key_json WHERE cookie_key = \"" + browser_cookie_key + "\"", function(err, rows_from_select) {
		// parse out JSON-style data that db returned:
		var parsed_rows = JSON.parse(rows_from_select[0].session_data);
		// save page_count portion of parsed data to its own variable:
		var pg_load = parsed_rows.page_count;
		// increment pg_load by 1 (because page loaded or refreshed to get to this portion of code):
		pg_load += 1;
		// update page_count portion of parsed_rows to equal the value of the incremented pg_load variable:
		parsed_rows.page_count = pg_load;
		// turn updated parsed_rows variable back to a JSON-style string:
		var stringed_row = JSON.stringify(parsed_rows);
		// update cookie_key_json table to reflect incremented page count data:
		db.run_smart("UPDATE cookie_key_json SET session_data = '" + stringed_row + "' WHERE cookie_key = \"" + browser_cookie_key + "\"", function(err, rows_from_update) {

			callback(pg_load);
		});
	});
};


