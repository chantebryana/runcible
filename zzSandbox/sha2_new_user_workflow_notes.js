// UNSALTED WORKFLOW//
// workflow to create a new hashed password for a new user account. this is unofficial b/c I do this manually in node and sqlite (rather than built in via website protocol)
//https://nodejs.org/api/crypto.html#crypto_class_hash
// I'm sure I could also make all of these functions nested and callback-based, thereby connecting all the bits and making the flow more automated. 

const crypto = require('crypto');
const hash = crypto.createHash('sha256');

hash.on('readable', () => {
  const data = hash.read();
  if (data) {
    console.log(data.toString('hex'));
		// after `hash.end()`, prints some hex string, which I then copy from node and then paste into the password field (for the newly generated user) in the relevant sqlite table.
  }
});

hash.write('/*password*/');
hash.end();

//////////////////////////////////////////////////////

// SALTED WORKFLOW//
// workflow to create salt
// https://ciphertrick.com/2016/01/18/salt-hash-passwords-using-nodejs-crypto/


const crypto = require('crypto');
const hash = crypto.createHash('sha256');

//var user_pass = /*'password string'*/
//var user_pass = 'hashword';
var user_pass = '';

var genRandomString = function(length){
	// this is all effectively one line of code, just broken up into easy-to-read(?) line breaks. 3 object-member-lookups run on `crypto` (the previous object); the order matters. can't return `crypto` without the object-member-lookups:
	return crypto.
		randomBytes(Math.ceil(length/2)).
		toString('hex'). 	// convert to hexadecimal format 
		slice(0,length);	// return required number of characters 
};

/*
// returns something like this: 
> getRandomString(10)
'c2e2998810'
> getRandomString(50)
'c7f233e34c12fd02bc166c223f808c8529841a6dba4755ec32'
*/

var hash_pass = user_pass + genRandomString(10);

hash.on('readable', () => {
  const data = hash.read();
  if (data) {
    console.log(data.toString('hex'));
		// prints some hex string, which I then copy from node and then paste into the password field (for the newly generated user) in the relevant sqlite table.
		// after `hash.end()`, prints something like:  7be789b230356245b2d499f780011479184f8cb00d3887aca3ac6c720627963c
  }
});

hash.write(hash_pass);
hash.end();
console.log('user password + salt: ' + hash_pass);
// prints something like: 'user password + salt: password43a03f2b5d'
