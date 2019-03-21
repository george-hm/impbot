const modDiscord = require("discord.js"); 
const bot = new modDiscord.Client();
const fs = require("fs");
const objConfig = JSON.parse(fs.readFileSync("./config.json", "utf8"));
const modHandler = require("handler.js");

bot.on("ready", () => {
	console.log("logged in as", bot.user.tag);
	bot.user.setActivity(prefix,"help");
});

bot.on("message", objMsg => {
	//TODO handle commands 
});
