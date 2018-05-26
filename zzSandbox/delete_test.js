var cycles = [4,3,2,1];
var time_temp = [5,4,3,-1]; // I need negative one as a C++-style hack to give `cycles` elements something to compare against

var diff = [];
var j = 0;
var k = 0;
for (i = 0; i < cycles.length; i++) {
  if (cycles[i] > time_temp[j]) {
    diff[k] = cycles[i];
    k++;
	} else if (cycles[i] == time_temp[j]) {
    j++;
	} else if (cycles[i] < time_temp[j]) {
    j++;
    i--;
	}
}

for (n = 0; n < diff.length; n++) {
  console.log(diff[n]);
}
