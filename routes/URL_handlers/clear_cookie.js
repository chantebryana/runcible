router.get('/clearcookie', function(req,res){
	// remove page_loads cookie from browser cache (and subsequently from the server's attempts to access browser's cache): 
	res.clearCookie('cookie_key');
	// send a message to the web page to let the user know something happened: 
	res.send('Cookie deleted');
});

app.listen(3000, function() {
	console.log('index.js listening on port 3000!');
});
