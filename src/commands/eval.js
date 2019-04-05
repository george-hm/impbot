module.exports = (context) => {
	return new Promise((resolve, reject) => {
		if (!context.code) {
			return reject("help");
		}
		let ev;
		try {
			ev = eval(context.code);
		}
		catch(e) {
			ev = e;
		}
		let arrRetMsg = [
			"**EVAL OUTPUT:**```js",
			ev,
			"```"
		];

		return resolve(context.objMsg.reply(arrRetMsg.join("\n")));
	});
}
