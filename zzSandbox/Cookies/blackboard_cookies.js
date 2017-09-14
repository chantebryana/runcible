// generate secret cookie id if one hasn't been defined yet

'aaa111'
'bbb222'
// these of course are silly keys, but they perhaps help to mimic a more real-world style of alphanumeric setup that changes with time. 

var alpha = "aaa"
var numeric = 111;
var secret_key = alpha + numeric; // returns 'aaa111'

var numb_a = Math.floor((Math.random() * 10) + 1);
var numb_b = Math.floor((Math.random() * 10) + 1);
var numb_c = Math.floor((Math.random() * 10) + 1);
numb_a = numb_a.toString();
numb_b = numb_b.toString();
numb_c = numb_c.toString();
var string = numb_a + numb_b + numb_c;
var numb_d = Math.floor((Math.random() * 10) + 1);
numb_d = numb_d.toString();
string = string + numb_d; // append new random number to end of string

// ok, so the above code is the beginnings of my own mental processes, but the below code is a direct copy of someone else's more sophisticated and streamlined solution to my problem. still a simple solution, and i'm glad that i thought through some of the things on my own, but i'm also glad that i found a pre-assembled function that i can pull!
// i suppose i'm glad that i worked through the problem a little bit on my own first, because i messed with most of the elements of more elegant solution below, and thereby got to think through it on my own terms before having the solution spoon-fed to me. kinda like a science experiment: i need to be unbiased to generate a hypothesis and conduct some experiments, but after that i could talk to other people...or something.
// https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript

function makeid() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 6; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
	};
  return text;
}

console.log(makeid());

// hmm, not sure there's much else i can do with this function: makeid() kind of made itself! but next steps could include a verification step: check the browser for cookie, check it against database, return 1 if matches, return 0 if not. then pass 1 or 0 to determine whether to run makeid(). or something.

/*
So, let's think about how a verification function would work. it will require arguments to be passed: the JSON-style string cookie key from the browser? how will that be formatted? 
*/
