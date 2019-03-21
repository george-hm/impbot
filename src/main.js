const modDiscord = require("discord.js"); 
const bot = new modDiscord.Client();
let fs = require("fs");
const objConfig = JSON.parse(fs.readFileSync("./config.json", "utf8"));

bot.on("ready", () => {
	console.log("logged in as", bot.user.tag);
	bot.user.setActivity(prefix,"help");
});

bot.on("message", objMsg => {
	//TODO handle commands 
});
