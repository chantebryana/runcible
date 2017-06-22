// "abandon" function find_cycle_id() for now - instead, "start over" with the
// 'cycle_brackets' function description given below:
 
// callback expected to take two parameters, both either integer IDs from the
// database or 'null' if no cycle is found following or preceding 'current'
function cycle_brackets(current_cycle_id, callback){
  ...
  // talk to the database, then get or pick out the relevant cycle IDs
  ...
 
  callback(previous_cycle_id, next_cycle_id);
 
  // no line like the following:
  // return {prev: previous_cycle_id , next: next_cycle_id}
}
 
 
...
  cycle_id = req.query.cycle;
  cycle_brackets(cycle_id, function(previous_cycle, next_cycle){
    db.all(..., function(error, rows){
      res.render('pages/', {
        rows_to_renderer: rows,
        cycles: {
          prev: previous_cycle,
          curr: cycle_id,
          next: next_cycle
        }
      });
    });
  });
...
 
// in the view (ie, index.ejs):
//  'rows_to_render' is the array it always was, but now you have 'cycles.prev' etc.

