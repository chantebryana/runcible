// Jim begins explaining cookies: 

function on_index_page_load(req, res) { // event handles begin with 'on'
	// we want to know: have we seen this browser before (get_session() ):
	// get_session() attempt to pick cookie data out of request: 
	var session_key = get_session(req);
	// if get_session() failed: 
	if (!session_key) {
	// session_key will be null, assign a new session; place new cookie data in the server's response headers: 
		session_key = issue_new_session(res); 
	}
	// looking up server side state var associated w/ active session; for our purposes this is a page_count, so we increment it by 1: 
	// must be done before rendering web page: 
	var page_count = get_session_data(session_key)+1

//	...
	// JE: incorporate page count into rendered view

	// after rendering save back incremented count to server side state variable / database: 
	// can be done any time after get_session_data has been incremented (ie, incorporating page count into rendered view could happen before or after set_session_data): 
	set_session_data(session_key, page_count)
}

// set_session_data, get_session_data
// i decide where the underlaying data is stored and how access works
// common to set aside table in db for storing data, at least 1 column keyed to cookie session key, at least 1 column containing session data
// lots of ways to format that db


//literal associative array example
// JavaScript Object Notation; 'JSON' -> JSON has taken on a life of its own...
var object = {param1:'some value', param2:103}
console.log(object.param1);
console.log(object['param2']*3);

// this will output 
// some value
// 309

var first_int = 18;
var some_int = other_int + 4;

var JSON_string = "{'array1':[1,2,3],'array2':[\"a\",\"b\",\"c\"]}";
var new_object = eval(JSON_string);



// ...	...	...
// https://www.codementor.io/noddy/cookie-management-in-express-js-du107rmna

app.get('/cookie', function(req,res){
	res.cookie(cookie_name, 'cookie_value').send('Cookie is set');
});
