const fs = require("fs");
const commandList = require(__dirname + "/../commands");
const templateList = JSON.parse(fs.readFileSync(__dirname + "/../configs/command_list.json", "utf8"));
const config = JSON.parse(fs.readFileSync(__dirname + "/../configs/config.json", "utf8"));

/**
 * Checks if a message is a command, then runs the command if its valid
 *
 * @param      {Object}   msg     The object message
 * @param      {Object}   bot	  The bot instance
 */
module.exports = async (msg, bot) => {
	const prefix = config.prefix;
	if (!msg.content.startsWith(prefix)) {
		return;
	}

	// get the command template, including the function
	const commandData = fetchCommand(
		msg.content.split(prefix)[1]
		.split(" ")[0]
	);
	const commandTemplate = commandData.template;

	if (!commandData || commandTemplate.on != "message") {
		return;
	}

	if (commandTemplate.admin == true) {
		// log some data
		bot.discordUser.adminLog(commandTemplate.name);

		if (!bot.discordUser.isAdmin()) {
			return msg.react("⛔");
		}
	}

	// create context to pass (this contains our args, we pass objMsg by default)
	let context = {
		msg: msg,
		bot: bot,
		templates: templateList,
		prefix: config.prefix
	};

	// merge the result of assembleArgs into context
	context = {...context, ...assembleArgs(msg.content, commandTemplate)};

	try {
		// running the command
		await commandData.command.main(context);
		return msg.react("✅");
	} catch (err) {
		if (err === "help") {
			context.command = commandTemplate.name;
			return msg.reply(
				"Something went wrong trying to run your command, see the help:```diff\n" +
				commandList.help.getCommandHelp(commandTemplate, config.prefix) +
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
	if (strCommand in templateList) {
		return {
			template: templateList[strCommand],
			command: commandList[strCommand]
		};
	}

	// find alias
	for (let strKey in templateList) {
		if (templateList[strKey].alias.includes(strCommand)) {
			return {
				template: templateList[strKey],
				command: commandList[strKey]
			};
		}
	}

	return false;
}

/**
 * Get user args and return an object with them
 *
 * @param      {String}  msgContent     A message to extract args from
 * @param      {Object}  template       The object to check for args
 * @returns    {Object}					An object containing the args
 * @example
 *   assembleArgs(
 *    "hey there",
 * 	  {"some_command":{"args":["foo", "bar"]}}
 *   ) -> {"foo":"hey", "bar":"there"}
 */
function assembleArgs(msgContent, template) {
	msgContent = msgContent.split(" ").slice(1);
	let toReturn = {};

	for (let arg = 0; arg < msgContent.length; arg++) {
		let templateArg = Object.keys(template.args)[arg];
		toReturn[templateArg] = msgContent[arg];
	}

	return toReturn;
}
