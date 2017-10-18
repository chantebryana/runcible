// https://www.w3schools.com/nodejs/nodejs_modules.asp
// using 'exports' keyword to make properties and methods available outside module file:
/*
// CE: removing exports to try to use require the way Jim mentioned yesterday:
//exports.myDateTime = function() {
myDateTime = function() {
	return Date();
}
*/
myDateTime = Date();
