module.exports.main = async (context) => {
	if (!context.code) {
		throw "help";
	}

	// this is a dirty fix so we can get the whole message (rather than 1 word)
	// e.g. "1 + 1" comes in as "1", we want the whole message
	context.code = context.msg.content.split(context.prefix + "eval")[1];

	let output;
	try {
		output = eval(context.code);
	}
	catch(e) {
		output = e;
	}
	let retMsg = [
		"**EVAL OUTPUT:**```js",
		output,
		"```"
	];

	return context.msg.reply(retMsg.join("\n"));
};
