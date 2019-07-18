let objCommands = {
	"uptime"    : require(__dirname + "/uptime"),
	"ping"      : require(__dirname + "/ping"),
	"avatar"    : require(__dirname + "/avatar"),
	"help"      : require(__dirname + "/help"),
	"eval"      : require(__dirname + "/eval.js"),
	"botsend"   : require(__dirname + "/botsend.js"),
	"snowflake" : require(__dirname + "/snowflake.js")
};

module.exports = objCommands;
