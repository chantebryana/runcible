// .get_pg_load combines the features of .get with the homemade functions check_browser_cookie() and increment_pg_load(), which together do the following: check browser for secret cookie id (and creates and saves [to browser cookie cache and to db table on server side] a new one if needed), and then accesses the page load variable and increments it up by 1. the final page load variable is passed forward to res.render, where the page count is printed on the rendered web page:
router.get_pg_load = function get_pg_load(url_string, callback){
	this.get(url_string, function(req, res){
		check_browser_cookie(req, res, function(secret_cookie) {
			increment_pg_load(secret_cookie, function(pg_load) {
				callback(req, res, pg_load);
			});
		});
	});
}
