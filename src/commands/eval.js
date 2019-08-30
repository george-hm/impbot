const main = async (context) => {
	if (!context.code) {
		throw "help";
	}

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

	return context.msg.reply(arrRetMsg.join("\n"));
};

export default {main};
