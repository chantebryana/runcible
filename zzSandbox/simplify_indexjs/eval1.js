// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/eval

// terminal readout: 
ruby@rubyVM:~/Projects/runcible$ node
> eval(new String('2 + 2'));
[String: '2 + 2']
> eval('2+2');
4
> .exit

ruby@rubyVM:~/Projects/runcible$ node
> var expression = new String('2+2');
undefined
> expression
[String: '2+2']
> eval(expression)
[String: '2+2']
> eval(expression.toString());
4
> var x = 7
undefined
> x
7
> eval('3*x+2');
23

//
//
//my code, still based on mozilla eval article
var x=3, y=5;
function test() {
	var x = 2, y = 4;
	console.log(eval('x+y')); // direct call, uses local scope, result is 6;
	var geval = eval; // equivelant to calling eval in the global scope
	console.log(geval('x+y')); // indirect call, uses global scope, throws ReferenceError b/c 'x' is undefined
	(0, eval)('x+y'); // another example of indirect call
}
test();

// terminal readout of function test():
> function test() {
... 	var x = 2, y = 4;
... 	console.log(eval('x+y')); // direct call, uses local scope, result is 6;
... 	var geval = eval; // equivelant to calling eval in the global scope
... 	console.log(geval('x+y')); // indirect call, uses global scope, throws ... 	console.log(geval('x+y')); // indirect call, uses global scope, throws erenceError b/c 'x' is undefined
... 	(0, eval)('x+y'); // another example of indirect call
... }
undefined
> test()
6
ReferenceError: y is not defined
    at eval (eval at test (repl:5:13), <anonymous>:1:3)
    at eval (native)
    at test (repl:5:13)
    at repl:1:1
    at REPLServer.defaultEval (repl.js:272:27)
    at bound (domain.js:287:14)
    at REPLServer.runBound [as eval] (domain.js:300:12)
    at REPLServer.<anonymous> (repl.js:441:12)
    at emitOne (events.js:82:20)
    at REPLServer.emit (events.js:169:7)
//CE add some global variables x and y: no referenceErrors here!
> var x=3, y=5;
undefined
> function test() {
... 	var x = 2, y = 4;
... 	console.log(eval('x+y')); // direct call, uses local scope, result is 6;
... 	var geval = eval; // equivelant to calling eval in the global scope
... 	console.log(geval('x+y')); // indirect call, uses global scope, throws ... 	console.log(geval('x+y')); // indirect call, uses global scope, throws erenceError b/c 'x' is undefined
... 	(0, eval)('x+y'); // another example of indirect call
... }
undefined
> test();
6
8
undefined
> 

