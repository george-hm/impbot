const uptime = require("./uptime");
const ping   = require("./ping");
const avatar = require("./avatar");
const help   = require("./help");

let objComands = {
	"uptime": uptime,
	"ping"  : ping,
	"avatar": avatar,
	"help"  : help
}

for (let command in objComands) {
	// e.g. module.exports.ping = objComands.ping.ping
	module.exports[command] = objComands[command]
}
