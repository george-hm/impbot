const fs = require("fs");
const modCommandList = require("./commands/index.js");
const g_objCommandTemplate = JSON.parse(fs.readFileSync("./command_list.json", "utf8"));



/**
 * finds a command in g_objCommandTemplate and returns it
 * as well as its actual function from modCommandList
 *
 * @param      {String}    strCommand  The command to try and fetch
 * @param      {Function}  callback    The callback
 * @return     {Promise}   {err, objCommandData, fnCommand}
 */
function fnFetchCommand(strCommand, callback) {
	return new Promise((resolve, reject) => {
		//if the command is in g_objCommandTemplate 
		if (strCommand in g_objCommandTemplate) {
			// return that command object
			return resolve(
				g_objCommandTemplate.strCommand,
				//return command here
			);
		}

		// loop through g_objCommandTemplate
		for (let strKey in g_objCommandTemplate) {
			// is the alias the command?
			if (g_objCommandTemplate.strKey.alias == strCommand) {
				// return command object
				return resolve(
					g_objCommandTemplate.strKey,
					//return command here
				);
			}
		}
		return reject("Command not found");
	}
}


/**
 * Checks if a message is a command, then runs the command if its valid
 *
 * @param      {String}    strPrefix   The string prefix that the bot uses
 * @param      {String}     strCommand  A message from a user
 * @param      {Function}  callback    The callback
 * @return     {<type>}    { description_of_the_return_value }
 */
module.exports.find = (strPrefix, strCommand, callback) => {
	// check if this a command
	if (strCommand.includes(strPrefix)) {
		// get the actual command function from fnFetchCommand	
		fnFetchCommand(strCommand.split(strPrefix)[1]).then((objCommandData, fnCommand) => {
			// TODO: check args, pass args, command returns err if wrong args
			// if wrong args return description (all commands have callback?)
			// 
			// need to check if command is on something other than "message"
			// check if admin etc.
		}).catch(err => {
			return err;
		});



		// if (modCommandList[Object.keys(objCommandTemplate)[0]]) {
		// 	if (objCommandTemplate.on == "message") {
		// 		let objArgs = {};
		// 		let strMsgSections = strCommand.split(strPrefix)[1].split(" ").slice(1);
		// 		for (let strElement = 0; strElement <= objCommandTemplate.args; strElement++) {
		// 			if (objCommandTemplate.args[strElement]) 
		// 				objArgs[objCommandTemplate.args[strElement]] = strMsgSections[strElement];
		// 			//TODO scrap this section? add callbacks to all commands so we can handle errors
		// 		}
		// 		return modCommandList[Object.keys(objCommandTemplate)[0]](objArgs);	
		// 	}
		// }
	}
}
