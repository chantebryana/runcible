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
