const fs = require("fs");
const listOfCommands = require(__dirname + "/commands");
const commandTemplate = JSON.parse(fs.readFileSync(__dirname + "/command_list.json", "utf8"));
const config = JSON.parse(fs.readFileSync(__dirname + "/config.json", "utf8"));

/**
 * Checks if a message is a command, then runs the command if its valid
 *
 * @param      {Object}   msg     The object message
 * @param      {Object}   bot	  The bot instance
 */
module.exports.find = async (msg, bot) => {
	let prefix = config.prefix;
	if (!msg.content.startsWith(prefix)) {
		return;
	}

	// get the command template, including the function
	let commandData = fetchCommand(
		msg.content.split(prefix)[1]
		.split(" ")[0]
	);

	if (!commandData || commandData.template.on != "message") {
		return;
	}

	if (commandData.template.admin == true) {
		// log some data
		bot.discordUser.adminLog(commandData.template.name);

		if (!bot.discordUser.isAdmin()) {
			return msg.react("⛔");
		}
	}

	// create context to pass (this contains our args, we pass objMsg by default)
	let context = {
		msg: msg,
		bot: bot,
		template: commandTemplate,
		prefix: config.prefix
	};

	// merge the result of assembleArgs into context
	context = {...context, ...assembleArgs(msg.content, commandData.template)};

	try {
		// running the command
		await commandData.command.main(context);
		return msg.react("✅");
	} catch (err) {
		if (err === "help") {
			context.command = commandData.template.name;
			return msg.reply(
				"Something went wrong trying to run your command, see the help:```diff\n" +
				listOfCommands.help.getCommandHelp(commandData.template, config.prefix) +
				"```"
			);
		}
		throw new Error(err);
	}
};

/**
 * finds a command in our command template and returns it as well as its actual
 * function from listOfCommands
 *
 * @param      {String}   strCommand  The command to try and fetch
 * @returns    {*}  	 			  {template, command} or false if nothing found
 */
function fetchCommand(strCommand) {
	if (strCommand in commandTemplate) {
		return {
			template: commandTemplate[strCommand],
			command: listOfCommands[strCommand]
		};
	}

	// find alias
	for (let strKey in commandTemplate) {
		if (commandTemplate[strKey].alias.includes(strCommand)) {
			return {
				template: commandTemplate[strKey],
				command: listOfCommands[strKey]
			};
		}
	}

	return false;
}

/**
 * Get user args and return an object with them
 *
 * @param      {String}  strArgs        A message to extract args from
 * @param      {Object}  template       The object to check for args
 * @returns    {Object}					An object containing the args
 * @example
 *   assembleArgs(
 *    "hey there",
 * 	  {"some_command":{"args":["foo", "bar"]}}
 *   ) -> {"foo":"hey", "bar":"there"}
 */
function assembleArgs(strMsgContent, template) {
	strMsgContent = strMsgContent.split(" ").slice(1);
	let toReturn = {};
	for (let strArg = 0; strArg < strMsgContent.length; strArg++) {
		toReturn[Object.keys(template.args)[strArg]] = strMsgContent[strArg];
	}

	return toReturn;
}
