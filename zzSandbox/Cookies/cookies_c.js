// CE pseudocode for creating unique session token, session data, and interacting with storage database and browser session (2017-08-24):

// create sqlite table for cookies and session data:
CREATE TABLE cookies (
	id INT PRIMARY KEY, 
	session_token TEXT, 
	session_data TEXT, 
	entry_created DATETIME DEFAULT (DATETIME('NOW', 'LOCALTIME'))
);

// sketching out ideas for what unique session token and session data might look like (super simplified):
session_token = "1000"; // this can and should be much more complicated
session_data = "42"; // this integer-string represents the number of page loads



// playing with server-side code that generates a new session_token (super-super simplified):
function new_session_token(callback) {
	// query session_token from db table, sorting in descending order so that largest session_token is on the top of the list (rows array):
	db.all("SELECT session_token FROM cookies ORDER BY session_token DESC",function(err, rows){
		// iterate the first element of rows by 1 so that the new session token is one larger than the previous one:
		rows[0] += 1; // (CE confirmed that this works on normal arrays)
		// pass iterated rows variable through callback to be used later on in server-side code:
		callback(rows);
	});
};
// what new_session_token looks like when called:
new_session_token(function(/*  */) {

});




// playing around with some flow control:

// cookie syntax example (i think): 
"key=value" // a generic cookie syntax example
"session_token=1000" // slightly more specific, using my super-simplified session_token laid out above

// creates a temporary variable that stores the value of the unique session id cookie found in browser: 
var browser_token = req.cookies.session_token

// pseudocode for db query:
db.all("SELECT session_token FROM cookies WHERE session_token = \"" + browser_token + "\""), function(err, rows) {
	if (rows.length == 0) { //no cookie exists: if db query results are null or undefined or an empty array
		// set a new cookie from the server to the browser / database
		// server generate new unique session id, and send it to browser and db
	} else { // a cookie does exist when checking btwn browser and db
		// update the page_load data (session_data in db) b/c i've presumably refreshed or loaded a new page, which means that my tally needs to iterate by one and be stored in db table
	}
});



