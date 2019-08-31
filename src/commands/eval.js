const main = async (context) => {
	if (!context.code) {
		throw "help";
	}

	// this is a dirty fix so we can get the whole message (rather than 1 word)
	// e.g. "1 + 1" comes in as "1", we want the whole message
	context.code = context.msg.content.split(context.prefix + "eval")[1];

	let output;
	try {
		// yes eval is dangerous, but we want eval
		/* jshint ignore:start */
		output = eval(context.code);
		/* jshint ignore:end */
	}
	catch(e) {
		output = e;
	}
	const arrRetMsg = [
		"**EVAL OUTPUT:**```js",
		output,
		"```"
	];

	return context.msg.reply(retMsg.join("\n"));
};

export default {main};
