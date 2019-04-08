const modDiscord = require("discord.js");
const bot = new modDiscord.Client();
const fs = require("fs");
const objConfig = JSON.parse(fs.readFileSync("./config.json", "utf8"));
const modHandler = require("./handler.js");
const modMongo = require("mongodb").MongoClient;

modMongo.connect(objConfig.db_host, {useNewUrlParser:true}).then(client => {
	const db = client.db(objConfig.db_name);
	bot.db = db;
}).catch(err => {
	console.log("Failed to connect to database, error: " + err);
});

bot.on("ready", () => {
	console.log("logged in as", bot.user.tag);
	bot.user.setActivity(objConfig.prefix + "help");
});

bot.on("message", objMsg => {
	// ignore everything coming from a bot
	if (objMsg.author.bot) {
		return;
	}

	if (bot.db) {
		bot.db.collection("discord_chats").insertOne(
			{
				user_id: objMsg.author.id,
				username: objMsg.author.username,
				discriminator: objMsg.author.discriminator,
				message: objMsg.content,
				where: objMsg.channel.id,
				timestamp: Date.now()
			}
		);
	}

	modHandler.find(objConfig.prefix, objMsg, bot);
});

bot.login(objConfig.bot_token);
