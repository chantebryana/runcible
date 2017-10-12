// Jim's homemade error-checking function that replaces db.all:
exports.db.run_smart = function run_smart(query_string, callback){
  this.all(query_string, function(err, rows){
    if(err) {
      console.log(err);
    } else {
    	callback(err, rows);
		}
  });
}

//module.exports = db.run_smart;
