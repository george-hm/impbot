module.exports.main = async (context) => {
	if (!context.code) {
		throw "help";
	}

	let output;
	try {
		output = eval(context.code);
	}
	catch(e) {
		output = e;
	}
	let arrRetMsg = [
		"**EVAL OUTPUT:**```js",
		output,
		"```"
	];

	return context.msg.reply(arrRetMsg.join("\n"));
};
