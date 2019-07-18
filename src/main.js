const discordjs = require("discord.js");
const bot = new discordjs.Client();
const fs = require("fs");
const config = JSON.parse(fs.readFileSync(__dirname + "/config.json", "utf8"));
const handler = require(__dirname + "/handler.js");
const mongoDb = require("mongodb").MongoClient;

// make a connection to the database
mongoDb.connect(
	config.db_host,
	{useNewUrlParser:true}
).then(client => {
	bot.db = client.db(config.db_name);
}).catch(err => {
	console.log("Failed to connect to database, error: " + err);
});

// triggered when the bot is logged in
bot.on("ready", () => {
	console.log("logged in as " + bot.user.tag);

	// pass snowflake util to bot, a command uses this
	bot.snowflake = discordjs.SnowflakeUtil;

	bot.user.setActivity(config.prefix + "help");
});

// this is ran every time a message is sent where the bot is present
bot.on("message", msg => {
	//TODO: welcome users, config for guilds and messages

	// ignore everything coming from a bot
	if (msg.author.bot) {
		return;
	}

	bot.timestamp = Date.now();


	// if bot.db, log every chat message we get
	if (bot.db) {
		bot.db.collection("discord_chats").insertOne(
			{
				user_id: msg.author.id,
				username: msg.author.username,
				discriminator: msg.author.discriminator,
				message: msg.content,
				where: msg.channel.id,
				timestamp: bot.timestamp
			}
		);
	}
	// console log if someone is dming the bot
	if (msg.channel.type == "dm") {
		console.log(msg.author.username + "#" +
			msg.author.discriminator + " => " +
			bot.user.username + "#" +
			bot.user.discriminator +
			": " + msg.content
		);
	}

	if (!bot.prefix) {
		bot.prefix = config.prefix;
	}

	handler.find(msg, bot);
});

// log the bot in using our token
bot.login(config.bot_token);
