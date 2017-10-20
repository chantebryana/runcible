dir = ['a.js', 'b.js', 'c.html', 'd.js', 'e.jpg'];

for (var i = 0; i < dir.length; i++) {
	// if last three characters of string is '.js', then console.log...
	// .includes() is imperfect (it searches the whole string instead of just the last 3 characters), but it's a step in the right direction: 
	if (dir[i].includes('.js')) {
		console.log(dir[i]);
	}
};

//var lastChar = myString[myString.length -1];

//console.log(dir[0].length -3);
//console.log(dir[0].charAt(dir[0].length -3));
//subst = dir[0].substring(3, -1);
//subst = dir[0].substr(-1, 4);
subst = dir[0].includes('.js');
console.log(subst)
