import uptime from "./uptime.js";
import ping from "./ping.js";
import avatar from "./avatar.js";
import help from "./help.js";
import evalc from "./eval.js";
import botsend from "./botsend.js";
import snowflake from "./snowflake.js";

const objCommands = {
	"uptime"    : uptime,
	"ping"      : ping,
	"avatar"    : avatar,
	"help"      : help,
	"eval"      : evalc,
	"botsend"   : botsend,
	"snowflake" : snowflake
};

export default objCommands;
