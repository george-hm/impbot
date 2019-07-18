/**
 * Ping the bot
 *
 * @param      {Object}   context  {objMsg, bot}
 * @return     {Promise}
 */
module.exports.main = async (context) => {
	if (!context.msg || !context.bot)
		throw "help";

	return context.msg.reply("Pong! Response time: " + context.bot.ping.toFixed(0) + "ms");
};
