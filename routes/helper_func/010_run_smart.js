// Jim's homemade error-checking function that replaces db.all:
//db.run_smart = function run_smart(query_string, callback){
db.run_smart = function run_smart(){
  callback = arguments[arguments.length-1];
  arguments[arguments.length-1] = function(err,rows){
//  this.all(query_string, function(err, rows){
    if(err) {
      console.log(err);
    } else {
    	callback(err, rows);
		}
  };//);
  this.all.apply(this, arguments);
};

// JE: using `arguments` reserved-word to demonstrate passing a variable-sized list of function arguments forward with some modifications - in this case, `run_smart` now supports "parameterized SQL queries" that automatically escape and quote parameter values
