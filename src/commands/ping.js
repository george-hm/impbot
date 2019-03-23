/**
 * Ping the bot
 *
 * @param      {Object}   context  {objMsg, bot}
 * @return     {Promise}  { description_of_the_return_value }
 */
module.exports.ping = (context) => {
	return new Promise((resolve, reject) => {
		if (!context.objMsg || !context.bot) {
			reject("help")
		}
		return resolve(context.objMsg.reply("Pong! Response time: " + context.bot.ping.toFixed(0) + "ms"));
	});
}
