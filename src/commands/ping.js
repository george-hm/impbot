/**
 * Ping the bot
 *
 * @param      {Object}   context  {objMsg, bot}
 * @return     {Promise}  
 */
module.exports = (context) => {
	return new Promise((resolve, reject) => {
		if (!context.objMsg || !context.bot)
			return reject("help")

		return resolve(context.objMsg.reply("Pong! Response time: " + context.bot.ping.toFixed(0) + "ms"));
	});
}
