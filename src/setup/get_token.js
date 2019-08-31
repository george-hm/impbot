const chat_pass = "ENTER_CHAT_PASS_HERE";

const axios = require("axios");

const options = {
	url:"https://www.hackmud.com/mobile/get_token.json",
	method: "POST",
	headers:{
		"Content-Type": "application/json"
	},
	data: {"pass":chat_pass},
	json:true
};

axios(options).then(result => {
	console.log(result.data);
}).catch(err =>{
	console.log(err.data);
});
