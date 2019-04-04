const uptime = require("./uptime");
const ping   = require("./ping");
const avatar = require("./avatar");
const help   = require("./help");
const eval_command = require("./eval.js");

let objComands = {
	"uptime": uptime,
	"ping"  : ping,
	"avatar": avatar,
	"help"  : help,
	"eval"  : eval_command
}

for (let command in objComands) {
	// e.g. module.exports.ping = objComands.ping.ping
	module.exports[command] = objComands[command]
}
