const fs = require("fs");
const modCommandList = require("./commands/index.js");
const g_objCommandTemplate = JSON.parse(fs.readFileSync("./command_list.json", "utf8"));
const g_objConfig = JSON.parse(fs.readFileSync("./config.json", "utf8"));

/**
 * Checks if a message is a command, then runs the command if its valid
 *
 * @param      {String}   strPrefix  The string prefix that the bot uses
 * @param      {Object}   objMsg     The object message
 * @param      {Object}   bot	  	 The bot instance
 * @return     {Promise}  { err, fnCommand }
 */
module.exports.find = (strPrefix, objMsg, bot) => {
	return new Promise((resolve, reject) => {
		if (objMsg.content.includes(strPrefix)) {
			// get the actual command function from fnFetchCommand	
			fnFetchCommand(objMsg.content.split(strPrefix)[1]).then((objCommandData, fnCommand) => {
				// is this a function we can use on a message event?
				if (objCommandData.on != "message")
					return resolve();

				// init args
				let strArgs = objMsg.content.split(strPrefix).slice(2);
				// create context to pass (this contains our args, we pass objMsg by default)
				let context = {
					objMsg: objMsg, 
					bot: bot
				};
				// the template args
				let arrTemplateArgs = objCommandData.args;
				// go through args and append, if any.
				for (let i = 0; i < objCommandData.args.length; i++) {
					if (strArgs[i]) {
						context[arrTemplateArgs[i]] = strArgs[i]; 
					}
				}

				// return the command
				fnCommand(context).then(() => {

				}).catch(err => {
					if (err == "help") {
						return resolve(objMsg.reply(
							objCommandData.description[0].replace("{PREFIX}", g_objConfig.prefix)
							.replace("{ARGS}", objCommandData.args.join(" ")) +
							"\n" +
							objCommandData.description[1]
						));	
					}
				});
				// TODO: check args, pass args, command returns err if wrong args
				// if wrong args return description (all commands have callback?)
				// 
				// need to check if command is on something other than "message"
				// check if admin etc.
			}).catch(err => {
				return reject(err);
			});
		}
	});
}

/**
 * finds a command in g_objCommandTemplate and returns it as well as its actual
 * function from modCommandList
 *
 * @param      {String}   strCommand  The command to try and fetch
 * @return     {Promise}  {err, objCommandData, fnCommand}
 */
function fnFetchCommand(strCommand) {
	return new Promise((resolve, reject) => {
		//if the command is in g_objCommandTemplate 
		if (strCommand in g_objCommandTemplate) {
			// return that command object
			return resolve(
				g_objCommandTemplate.strCommand,
				modCommandList.strCommand
			);
		}

		// find alias
		// loop through g_objCommandTemplate
		for (let strKey in g_objCommandTemplate) {
			// is the alias the command?
			if (g_objCommandTemplate.strKey.alias == strCommand) {
				// return command object
				return resolve(
					g_objCommandTemplate.strKey,
					modCommandList.strKey
				);
			}
		}
		return reject("Command not found");
	});
}
