// imports so that babel works
import "regenerator-runtime";
import "core-js";

import {Client, SnowflakeUtil} from "discord.js";
import fs from "fs";
import handlers from "./handlers";
import database from "./models/database.js";
import User from "./models/user.js";
const bot = new Client();
const config = JSON.parse(fs.readFileSync(__dirname + "/configs/config.json", "utf8"));

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

	bot.snowflake = SnowflakeUtil;
	bot.cache = {};

	bot.user.setActivity(config.prefix + "help");
});

// triggered on a message being sent
bot.on("message", msg => {
	//TODO: welcome users, config for guilds and messages

	if (msg.author.bot) {
		return;
	}

	// save user data to db
	bot.discordUser = new User(msg);
	bot.discordUser.save();

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
setTimeout(config.check_time).then(async () => {
	const successfulRun = await handlers.interval(bot);
});

bot.login(config.bot_token);
