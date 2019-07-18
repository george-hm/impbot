/**
 * Return uptime of the bot
 *
 * @param      {Object}   context  { objMsg, bot }
 * @return     {Promise}
 */
module.exports.main = async (context) => {
	if (!context.msg || !context.bot)
		throw "help";

	let intUptime = (context.bot.uptime/1000).toFixed(0);
	return context.msg.reply("Uptime: " + intUptime + " seconds.");
};
