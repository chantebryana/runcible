var name_age_arr = [{name: 'Tony', age: 33}, {name: 'Tanya', age: 27}, {name: 'Fatima', age: 41}];

function map_array_hash(array_hash, callback) {
	var name = [];
	for(i = 0; i < array_hash.length; i++) {
		//console.log(array_hash[i].name);
		name[i] = array_hash[i].name;
		//console.log(name[i]);
	}
	//console.log(name);
	callback(name);
};

map_array_hash(name_age_arr, function(name) {
	for(i = 0; i < name.length; i++) {
		console.log(name[i]);
	};
});
//Tony
//Tanya
//Fatima
//return undefined

