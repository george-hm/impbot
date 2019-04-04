module.exports = (context) => {
	return new Promise((resolve, reject) => {
		if (!context.code) {
			return reject("help");
		}
		let arrRetMsg = [
			"**EVAL OUTPUT:**```js",
			"[EVAL]",
			"```"
		];
		let ev;
		try {
			ev = eval(context.code);
		}
		catch(e) {
			ev = e;
		}

		arrRetMsg[1] = ev;
		return resolve(context.objMsg.reply(arrRetMsg.join("\n")));
	});
}
