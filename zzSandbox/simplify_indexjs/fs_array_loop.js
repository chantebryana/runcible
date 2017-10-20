dir = ['a.js', 'b.js', 'c.html', 'd.js', 'e.jpg'];

for (var i = 0; i < dir.length; i++) {
	// if last three characters of string is '.js', then console.log:
	if (dir[i].slice(-3) == '.js') {
		console.log(dir[i]);
	}
};

//var lastChar = myString[myString.length -1];

//console.log(dir[0].length -3);
//console.log(dir[0].charAt(dir[0].length -3));
//subst = dir[0].substring(3, -1);
//subst = dir[0].substr(-1, 4);
//subst = dir[0].includes('.js');
subst = dir[0].slice(-3);
console.log(subst)
