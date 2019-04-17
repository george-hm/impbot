const modDiscord = require("discord.js");
const bot = new modDiscord.Client();
const fs = require("fs");
const objConfig = JSON.parse(fs.readFileSync("./config.json", "utf8"));
const modHandler = require("./handler.js");
const modMongo = require("mongodb").MongoClient;

// make a connection to the database
modMongo.connect(
	objConfig.db_host,
	{useNewUrlParser:true}
).then(client => {
	const db = client.db(objConfig.db_name);
	bot.db = db;
}).catch(err => {
	console.log("Failed to connect to database, error: " + err);
});

// triggered when the bot is logged in
bot.on("ready", () => {
	console.log("logged in as", bot.user.tag);

	// pass snowflake util to bot, a command uses this
	bot.snowflake = modDiscord.SnowflakeUtil;

	// set user activity to prefix + help, e.g. "/help"
	bot.user.setActivity(objConfig.prefix + "help");
});

// this is ran every time a message is sent where the bot is present
bot.on("message", objMsg => {
	//TODO: welcome users, config for guilds and messages

	// ignore everything coming from a bot
	if (objMsg.author.bot) {
		return;
	}

	// unix timestamp, ending in seconds
	bot.timestamp = Math.floor(Date.now() / 1000);

	// if bot.db, log every chat message we get
	if (bot.db) {
		bot.db.collection("discord_chats").insertOne(
			{
				user_id: objMsg.author.id,
				username: objMsg.author.username,
				discriminator: objMsg.author.discriminator,
				message: objMsg.content,
				where: objMsg.channel.id,
				timestamp: bot.timestamp
			}
		);
	}
	// console log if someone is dming the bot
	if (objMsg.channel.type == "dm") {
		console.log(objMsg.author.username + "#" +
			objMsg.author.discriminator + " => " +
			bot.user.username + "#" +
			bot.user.discriminator +
			": " + objMsg.content
		);
	}

	modHandler.find(objConfig.prefix, objMsg, bot);
});

// log the bot in using our token
bot.login(objConfig.bot_token);
