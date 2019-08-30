// imports so that babel works
import "regenerator-runtime";
import "core-js";

import {Client, SnowflakeUtil} from "discord.js";
import fs from "fs";
import handler from "./handler.js";
import database from "./models/database.js";
import User from "./models/user.js";
const bot = new Client();
const config = JSON.parse(fs.readFileSync(__dirname + "/configs/config.json", "utf8"));

database.connect(
	config.db_host,
	config.db_name
).catch(err => {
	console.log(
		"Database " +
		err.toString() +
		"\n\nNot logging data."
	);
});

// triggered when the bot is logged in
bot.on("ready", () => {
	console.log("logged in as " + bot.user.tag);

	// pass snowflake util to bot, a command uses this
	bot.snowflake = SnowflakeUtil;

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

	handler(msg, bot);
});

// log the bot in using our token
bot.login(config.bot_token);
