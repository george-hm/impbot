const uptime = require("./uptime");
const ping   = require("./ping");
const avatar = require("./avatar");
const help   = require("./help");
const eval_command = require("./eval.js");
const botsend = require("./botsend.js");
const snowflake = require("./snowflake.js");

let objComands = {
	"uptime"    : uptime,
	"ping"      : ping,
	"avatar"    : avatar,
	"help"      : help,
	"eval"      : eval_command,
	"botsend"   : botsend,
	"snowflake" : snowflake
}

for (let command in objComands) {
	// e.g. module.exports.ping = objComands.ping
	module.exports[command] = objComands[command]
}
