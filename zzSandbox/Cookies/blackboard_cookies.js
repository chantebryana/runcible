// create function that contains .get or .post along with pg_load functions

//Jim's 'run_smart': 
db.run_smart = function run_smart(query_string, callback){
  this.all(query_string, function(err, rows){
    if(err) {
      console.log(err);
    } else {
      callback(err, rows);
    }
  });
}

//old db.all: 
db.all (query='SELECT id FROM cycles WHERE id = ' + which_cycle_id, function(err, current_cycle) {

});


//Template of 'pg_load' setup: 
router.get('/', function(req, res){
  // do unrelated stuff? 
  check_browser_cookie(req, res, function(secret_cookie) {
    increment_pg_load(secret_cookie, function(pg_load) {
      // do unrelated stuff???
      res.render('pages', {
        // ... 
        pg_load_to_renderer: pg_load;
        // ...
      });
    });
  });
});

// here goes nothing: 
router.get_pg_load = function get_pg_load(url_string, callback){
	this.get(url_string, function(req, res){
		check_browser_cookie(req, res, function(secret_cookie) {
			increment_pg_load(secret_cookie, function(pg_load) {
				callback(req, res, pg_load);
			});
		});
	});
}

// in action: 
router.get_pg_load('/', function(req, res) {
	// ...
	res.render('pages', {
		//...
		pg_load_to_renderer: pg_load;
		//...
	});
});

/*
tried to implement in index.js and get this error message: 

/home/ruby/Projects/runcible/node_modules/sqlite3/lib/trace.js:27
throw err;
^

ReferenceError: pg_load is not defined
at Statement. (/home/ruby/Projects/runcible/routes/index.js:434:30)
--> in Database#all('SELECT begin_date, date(begin_date, '-1 day') as 'end_date', strftime('%Y-%m-%d %H:%M:%S', begin_date) as 'begin_datetime', strftime('%Y-%m-%d %H:%M:%S', begin_date, '-1 day') as 'end_datetime' FROM cycles WHERE id = 9 or id = 10 ORDER BY begin_date', [Function])
at Statement. (/home/ruby/Projects/runcible/routes/index.js:398:11)
*/
