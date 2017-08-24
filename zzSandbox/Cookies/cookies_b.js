// CE PLAYING AROUND W/ COOKIE-LIKE OBJECTS

var express = require('express');
var path = require('path'); // makes app.use(express.static ... work down below

var cookieParser = require('cookie-parser');
var cookie = require('cookie');  // https://www.npmjs.com/package/cookie
var cookie_var = ""; // CE: temporary cookie variable
var bodyParser = require('body-parser');

// rows equals string formatted like a cookie: 
var rows = "key=value;page_loads=0;name=Chante";
// print rows to make sure it looks correctly: 
console.log("CE playing around: ", rows);
// parse the rows string so that the key:value pairs are separated and usable more like a conventional associative array or dictionary or object:
var parsed_rows = cookie.parse(rows);
// print parsed_rows to make sure it behaves correct: 
console.log("parsed_rows: ", parsed_rows);
// print the value of page_loads key within parsed_rows to make sure it behaves correctly: 
console.log("parsed_rows.page_loads: ", parsed_rows.page_loads);
// save value of page_loads key into its own variable (and turn it from string to int so that I can iterate it on the next line): 
var page_load_var = parseInt(parsed_rows.page_loads);
page_load_var += 1;
// push a string-ified version of iterated page_load_var back to parsed_rows:
parsed_rows.page_loads = page_load_var.toString();
// print it to check my work: 
console.log("parsed_rows: ", parsed_rows);
var row_var = cookie.serialize('key', parsed_rows.key, 'page_loads', parsed_rows.page_loads, 'name', parsed_rows.name);
var row_var = cookie.serialize('page_loads', parsed_rows.page_loads);
console.log("row_var: ", row_var);

// db query to select values that contain a certain string: 
/*
SELECT *
FROM table
WHERE field LIKE "Hel%"
*/
// this would select a field value of "Hello, World!", as a for-instance


