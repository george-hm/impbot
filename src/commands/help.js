/**
 * returns help of call commands or only one command
 *
 * @param      {Object}   context  The context
 * @return     {Promise}
 */
async function main(context) {
		if (!context.templates) {
			throw "Missing required data context.templates";
		}

		if (context.command) {
			let objCommandData = context.templates[context.command];
			if (objCommandData) {
				let strRetMsg = [
					"```diff",
					"+ " + context.command,
					getCommandHelp(objCommandData, context.prefix),
					"```"
				].join("\n");

				return context.msg.reply(strRetMsg);
			}

			return context.msg.reply("Command does not exist.");
		}

		let arrCommandHelpSummary = [
			"**COMMANDS:**",
			"```diff",
		];
		for (let strCommand in context.templates) {
			if (context.templates[strCommand].on != "message") {
				continue;
			}

			let strComHelp = module.exports.getCommandHelp(
				context.templates[strCommand],
				context.prefix,
				true
			);

			arrCommandHelpSummary.push(
				"+ " + strComHelp + "\n"
			);
		}
		arrCommandHelpSummary.push("```");
		let strReturnMsg = arrCommandHelpSummary.join("\n");
		return context.msg.reply(strReturnMsg);
}

/**
 * Returns the help dialogue of a command
 *
 * @param      {Object}   template  Used to fetch the descriptions
 * @param      {String}   prefix    The prefix for the bot
 * @param      {Boolean}  short     If we should return simple help message or not
 * @return     {String}  Command information
 */
function getCommandHelp(template, prefix, short) {
	// add arguments to args
	let args = "";
	Object.keys(template.args).forEach(arg => {
		args += (template.args[arg]) + ", ";
	});
	args = args.slice(0, -2);

	let usage =  prefix +
		template.name +
		" " +
		args;

		if (short) {
			returnData = usage + "\n\t" + template.desc;
		} else {
			returnData = [
				"alias(es):\n\t" + template.alias.join(", "),
				"\nusage:\n\t" + usage,
				"\nDescription:\n\t" + template.desc
			].join("\n");
		}

	return returnData;
}

module.exports = {main, getCommandHelp};
