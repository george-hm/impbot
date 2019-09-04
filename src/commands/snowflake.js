/**
 * Gets snowflake info from a user
 * This contains various information like when they created their discord account.
 *
 * @param {*} context
 */
const main = async context => {
	if (!context.target) {
		throw "help";
	}

	const objSnowflake = context.bot.snowflake.deconstruct(context.target);
	// if timestamp is 1420070400000 we have default return data, this is not a snowflake
	if (!objSnowflake || objSnowflake.timestamp === 1420070400000) {
		return context.msg.reply("Cannot find snowflake info.");
	}

	return context.msg.reply("```js\n" + JSON.stringify(objSnowflake, null, 2) + "```");
};

export default {main};
