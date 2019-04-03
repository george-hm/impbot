const chat_pass = "ENTER_CHAT_PASS_HERE"

let rp = require("request-promise");

let options = {
	url:"https://www.hackmud.com/mobile/get_token.json",
	method: "POST",
	headers:{
		"Content-Type": "application/json"
	},
	body: {"pass":chat_pass},
	json:true
};

rp(options).then($ => {
	console.log($.chat_token);
}).catch(err =>{
	console.log(err);
});