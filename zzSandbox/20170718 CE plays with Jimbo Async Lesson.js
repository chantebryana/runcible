var name_age_arr = [{name: 'Tony', age: 33}, {name: 'Tanya', age: 27}, {name: 'Fatima', age: 41}];

function print(array) {
	for(i = 0; i < array.length; i++) {
		console.log(array[i]);
	};
};

function map_array_hash(array_hash, key, callback) {
	var array = [];
	for(i = 0; i < array_hash.length; i++) {
		array[i] = array_hash[i][key]; // not .key or not ['key']
	}
	callback(array);
};

map_array_hash(name_age_arr, 'age', function(array) {
	print(array);
});
//Tony
//Tanya
//Fatima
//return undefined

