/**
 * Returns help of call commands or only one command
 *
 * @param      {Object}   context  The context
 * @return     {Promise}
 */
 const main = async context => {
		if (!context.template) {
			throw "Missing required data context.template";
		}

		if (context.command) {
			let objCommandData = context.templates[context.command];
			if (objCommandData) {
				const strRetMsg = [
					"```diff",
					"+ " + context.command,
					getCommandHelp(objCommandData, context.prefix),
					"```"
				].join("\n");

				return context.msg.reply(strRetMsg);
			}

			return context.msg.reply("Command does not exist.");
		}

		const arrCommandHelpSummary = [
			"**COMMANDS:**```diff",
		];
		for (let strCommand in context.templates) {
			if (context.templates[strCommand].on != "message") {
				continue;
			}

			const strComHelp = getCommandHelp(
				context.template[strCommand],
				context.prefix,
				true
			);

			arrCommandHelpSummary.push(
				"+ " + strComHelp + "\n"
			);
		}
		arrCommandHelpSummary.push("```");
		const strReturnMsg = arrCommandHelpSummary.join("\n");
		return context.msg.reply(strReturnMsg);
};

/**
 * Returns the help dialogue of a command
 *
 * @param      {Object}   template  Used to fetch the descriptions
 * @param      {String}   prefix    The prefix for the bot
 * @param      {Boolean}  short     If we should return simple help message or not
 * @return     {String}  Command information
 */
const getCommandHelp = (template, prefix, short) => {
	// add arguments to args
	let args = "";
	Object.keys(template.args).forEach(arg => {
		args += (template.args[arg]) + ", ";
	});
	args = args.slice(0, -2);

	const usage =  prefix +
		template.name +
		" " +
		args;

	let returnData;
	if (short) {
		returnData = usage + "\n\t" + template.desc;
	} else {
		returnData = "alias(es):\n\t" + template.alias.join(", ") +
			"\nusage:\n\t" + usage +
			"\nDescription:\n\t" + template.desc;
	}

	return returnData;
};

export default {main, getCommandHelp};
