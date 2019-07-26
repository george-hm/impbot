const discordjs = require("discord.js");
const bot = new discordjs.Client();
const fs = require("fs");
const config = JSON.parse(fs.readFileSync(__dirname + "/configs/config.json", "utf8"));
const database = require(__dirname + "/models/database.js");
const handlers = require(__dirname + "/handlers");
const User = require(__dirname + "/models/user.js");
const util = require('util');
setTimeout = util.promisify(setTimeout);

database.connect(
	config.db_host,
	config.db_name
).catch(err => {
	console.log(
		"Database: " +
		err.toString() +
		"\n\nNot logging data."
	);
});

// triggered when the bot is logged in
bot.on("ready", () => {
	console.log("logged in as " + bot.user.tag);

	// pass snowflake util to bot, a command uses this
	bot.snowflake = discordjs.SnowflakeUtil;
	bot.cache = {};

	bot.user.setActivity(config.prefix + "help");
});

// triggered on a message being sent
bot.on("message", msg => {
	//TODO: welcome users, config for guilds and messages

	// ignore everything coming from a bot
	if (msg.author.bot) {
		return;
	}

	// create user class (for checks and logging data to db)
	bot.discordUser = new User(msg);
	bot.discordUser.save();

	// console log if someone is dming the bot
	if (msg.channel.type == "dm") {
		console.log(
			bot.discordUser.getUsername() + "#" +
			bot.discordUser.getDiscrim() + " => " +
			bot.user.username + "#" +
			bot.user.discriminator +
			": " + msg.content
		);
	}

	return handlers.message(msg, bot);
});

// every X seconds run this
setTimeout(config.check_time).then(() => {
	handlers.interval(bot);
});

// log the bot in using our token
bot.login(config.bot_token);
