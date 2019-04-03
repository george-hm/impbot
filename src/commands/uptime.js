/**
 * Return uptime of the bot
 *
 * @param      {Object}   context  { objMsg, bot }
 * @return     {Promise}  
 */
module.exports = (context) => {
	return new Promise((resolve, reject) => {
		if (!context.objMsg || !context.bot)
			return reject("help");

		let intUptime = (context.bot.uptime/1000).toFixed(0);
		return resolve(context.objMsg.reply("Uptime: " + intUptime + " seconds."));
	});
}
