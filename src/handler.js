let fs = require("fs");
let modCommandList = require("./commands/index.js");
const g_objCommands = JSON.parse(fs.readFileSync("./command_list.json", "utf8"));

function fnIsCommand(strCommand, callback) {
	if (strCommand in g_objCommands) {
		return g_objCommands.strCommand;
	}
	for (let strKey in g_objCommands) {
		if (g_objCommands.strKey.alias == strCommand) {
			return g_objCommands.strKey;
		}
	}
	return {};
} 

module.exports.findCommand = (strPrefix, strCommand, callback) => {
	if (strCommand.includes(strPrefix)) {	
		let objCommandTemplate = fnIsCommand(strCommand.split(strPrefix[1]));

		if (modCommandList[Object.keys(objCommandTemplate)[0]]) {
			if (objCommandTemplate.on == "message") {
				let args = []
				for (let strElement = 0; strElement <= objCommandTemplate.args; strElement++) {
					//TODO scrap this section? add callbacks to all commands so we can handle errors
					
				}

				return modCommandList[Object.keys(objCommandTemplate)[0]]()	
			}	
		}
	}
}