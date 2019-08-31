/**
 * Return uptime of the bot
 *
 * @param      {Object}   context  { objMsg, bot }
 * @return     {Promise}
 */
const main = async (context) => {
	if (!context.msg || !context.bot)
		throw "help";

	const intUptime = (context.bot.uptime/1000).toFixed(0);
	return context.msg.reply("Uptime: " + intUptime + " seconds.");
};

export default {main};
