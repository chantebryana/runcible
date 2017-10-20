dir = ['a.js', 'b.js', 'c.html', 'd.js', 'e.jpg'];
dir_js = [];

for (var i = 0; i < dir.length; i++) {
	// if last three characters of string is '.js', then push elements to dir_js array:
	if (dir[i].slice(-3) == '.js') {
		dir_js.push(dir[i]);
	}
};

// print elements of dir_js array to ensure that everything's working: 
for (var i = 0; i < dir_js.length; i++) {
	console.log(dir_js[i]);
};
