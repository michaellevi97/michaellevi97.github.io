self.onmessage = function(e) {
	console.log('Message received from main script');
	var uang1=e.data[0];
	var uang2=e.data[1];
	var nominal=e.data[2];
	console.log(uang1);
	console.log(uang2);
	console.log(nominal);
	var total=0;

	total=uang1/uang2*nominal;
	
	console.log('Posting message back to main script');
	console.log(total);
	postMessage(total);
}