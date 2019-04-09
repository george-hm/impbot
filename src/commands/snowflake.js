module.exports = (context) => {
	return new Promise((resolve, reject) => {
		if (!context.target) {
			return reject("help");
		}

		let objSnowflake = context.bot.snowflake.deconstruct(context.target);
		// if timestamp is 1420070400000 we have default return data, this is not a snowflake
		if (!objSnowflake || objSnowflake.timestamp === 1420070400000) {
			return resolve(context.objMsg.reply("Cannot find snowlfake info."));
		}

		return resolve(context.objMsg.reply("```js\n" + JSON.stringify(objSnowflake, null, 2) + "```"));
	});
}
