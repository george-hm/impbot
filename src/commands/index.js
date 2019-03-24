const uptime = require("./uptime");
const ping   = require("./ping");

let objComands = {
	"uptime": uptime,
	"ping"  : ping
}

for (let command in objComands) {
	// e.g. module.exports.ping = objComands.ping.ping
	module.exports[command] = objComands[command][command]
}
