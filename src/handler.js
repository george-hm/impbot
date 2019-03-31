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
		if (objMsg.content.startsWith(strPrefix)) {
			// get the actual command function from fnFetchCommand
			fnFetchCommand(objMsg.content.split(strPrefix)[1].split(" ")[0]).then(([objCommandData, fnCommand]) => {
				// is this a function we can use on a message event?
				if (objCommandData.on != "message")
					return resolve();

				// create context to pass (this contains our args, we pass objMsg by default)
				let context = {
					objMsg: objMsg, 
					bot: bot,
					objCommandTemplate: g_objCommandTemplate
				};
				// the template args
				let arrTemplateArgs = objCommandData.args;
				
				context = fnAssembleArgs(objMsg.content, objCommandData, context);


				// return the command
				fnCommand(context).then(() => {
					objMsg.react("✅");
				}).catch(err => {
					if (err === "help") {
						return reject(fnCommandHelp(objCommandData));
					}

					console.log(err);
				});
				// TODO: check args, pass args, command returns err if wrong args
				// if wrong args return description (all commands have callback?)
				// 
				// need to check if command is on something other than "message"
				// check if admin etc.
			}).catch(err => {
				return; //console.log(err);
			});
		}

		return;
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
				[
					g_objCommandTemplate[strCommand],
					modCommandList[strCommand]
				]
			);
		}

		// find alias
		// loop through g_objCommandTemplate
		for (let strKey in g_objCommandTemplate) {
			// is the alias the command?
			if (g_objCommandTemplate[strKey].alias.includes(strCommand)) {
				// return command object
				return resolve(
					[
						g_objCommandTemplate[strKey],
						modCommandList[strKey]
					]
				);
			}
		}
		return reject("Command not found");
	});
}


/**
 * Returns the help dialogue of a command 
 *
 * @param      {Object}  objCommandData  Used to fetch the descriptions
 * @return     
 */
function fnCommandHelp(objCommandData) {
	let strDescToReplace = objCommandData.desc[0];
	strDescToReplace.replace("{PREFIX}", g_objConfig.prefix);
	let arrArgs = [];
	for (let strArg in objCommandData) {
		arrArgs.push(objCommandData[strArg]);
	}
	strDescToReplace.replace("{ARGS}", arrArgs.join(" "));

	return objMsg.reply(
		strDescToReplace + "\n" + objCommandData.desc[1]
	);	
}


/**
 * Adds all args to context, if applicable
 *
 * @param      {String}  strArgs         A message to extract args from
 * @param      {Object}  objCommandData  The object to check for args
 * @param      {Object}  context         The context to append args to
 */
function fnAssembleArgs(strMsgContent, objCommandData, context) {
	strMsgContent = strMsgContent.split(" ").slice(1);
	console.log(Object.keys(objCommandData.args));
	for (let strArg = 0; strArg < strMsgContent.length; strArg++) {
		context[Object.keys(objCommandData.args)[strArg]] = strMsgContent[strArg];
	}

	return context;
}