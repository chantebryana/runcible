// an attempt to assign an array of objects from db query to js variable: which i later hope to port over to chartist_partial_temp.ejs so that chartist.js and moment.js can play together to create a chart that displays holes in the data for days which don't contain a temperature log

var db_data = [
	{date: '2017-07-01', temp_f: 97}, 
	{date: '2017-07-02', temp_f: 95}, 
	{date: '2017-07-04', temp_f: 99}, 
	{date: '2017-07-05', temp_f: 96}, 
	{date: '2017-07-07', temp_f: 98}
];

date_temp_object = [];

// assign enough objects to my array:
//for (var i = 0; i < db_data.length; i++) {
	//date_temp_object[i] = {};
//}

// assign new object in array, and then put db query data into each of my array objects:
for (var i = 0; i < db_data.length; i++) {
	date_temp_object[i] = {};
	date_temp_object[i].x_date = "new Date (\'" + db_data[i].date + "T12:00\')";
	date_temp_object[i].y_temp = db_data[i].temp_f;
};

for (var i = 0; i < db_data.length; i++) { console.log(date_temp_object[i].x_date + ", " + date_temp_object[i].y_temp) };




					{x: new Date('2017-07-01T12:00'), y: 97.0}, 
					{x: new Date('2017-07-02T12:00'), y: 97.2}, 
					{x: new Date('2017-07-03T12:00'), y: 97.1}, 
					{x: new Date('2017-07-04T12:00'), y: 97.5}, 
					{x: new Date('2017-07-06T12:00'), y: 97.4}


x_array = [
	"new Date('2017-07-01T12:00')", 
	"new Date('2017-07-02T12:00')", 
	"new Date('2017-07-03T12:00')", 
	"new Date('2017-07-04T12:00')", 
	"new Date('2017-07-06T12:00')"
]

y_array = [97.0, 97.2, 97.1, 97.5, 97.4]


					<% date_temp_object_to_renderer.forEach(axis)=> { %>
						{x: <%- axis.x %> , y: <%= axis.y %>}, 
					<% } %>

					{x: <%- x_array_to_renderer[0] %>, y: <%= y_array_to_renderer[0] %>}, 
					{x: <%- x_array_to_renderer[1] %>, y: <%= y_array_to_renderer[1] %>}, 
					{x: <%- x_array_to_renderer[2] %>, y: <%= y_array_to_renderer[2] %>}, 
					{x: <%- x_array_to_renderer[3] %>, y: <%= y_array_to_renderer[3] %>}, 
					{x: <%- x_array_to_renderer[4] %>, y: <%= y_array_to_renderer[4] %>}


var single_array = [
	{temp: 97},
 	{temp: 95}, 
	{temp: 99}, 
	{temp: 96}, 
	{temp: 98}, 
];

temp_obj = [];

for (var i = 0; i < single_array.length; i++) {
	temp_obj[i] = {};
}

for (var i = 0; i < single_array.length; i++) {
	temp_obj[i].y = single_array[i].temp;
}

for (var i = 0; i < single_array.length; i++) {console.log(temp_obj[i].y)};


