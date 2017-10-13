// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/eval

var x = 6;
var str = "if (x==5) {console.log('z is 42'); z=42; x=420;} else z = 0;";

console.log('x is eval:', eval(str)); 
console.log('x is', x);
/*
//rewritten if statement with line breaks
if(x==5) {
	console.log('z is 42');
	z = 42;
	x = 420;
} else {
	z = 0;
}
*/
