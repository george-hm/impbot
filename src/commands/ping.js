const {Client} = require("discord.js");
const bot = new Client();

module.exports.ping = (objMsg) => {
	return msg.reply("Pong! Response time:", bot.ping);
}
