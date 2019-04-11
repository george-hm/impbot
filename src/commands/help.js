/**
 * returns help of call commands or only one command
 *
 * @param      {Object}   context  The context
 * @return     {Promise}
 */
module.exports = (context) => {
	return new Promise((resolve, reject) => {
		if (!context.objCommandTemplate) {
			return reject("Missing required data context.objCommandTemplate");
		}

		if (context.command) {
			let objCommandData = context.objCommandTemplate[context.command];
			if (objCommandData) {
				let strRetMsg = [
					"```md",
					"- " + context.command + ":",
					fnCommandHelp(objCommandData, context.prefix),
					"```"
				].join("\n");

				return resolve(context.objMsg.reply(strRetMsg));
			}

			return resolve(context.objMsg.reply("Command does not exist."));
		}

		let arrCommandHelpSummary = [
			"**COMMANDS:**",
			"```diff",
		]
		for (let strCommand in context.objCommandTemplate) {
			if (context.objCommandTemplate[strCommand].on != "message") {
				continue;
			}

			let strComHelp = fnCommandHelp(
				context.objCommandTemplate[strCommand],
				context.prefix,
				true
			);

			arrCommandHelpSummary.push(
				"+ " + strComHelp + "\n"
			);
		}
		arrCommandHelpSummary.push("```");
		let strReturnMsg = arrCommandHelpSummary.join("\n");
		return resolve(context.objMsg.reply(strReturnMsg));

	});
};

/**
 * Returns the help dialogue of a command (uses objMsg.reply)
 *
 * @param      {Object}  objCommandData  Used to fetch the descriptions
 * @param      {String}  prefix          The bot prefix
 * @return     {String}  Command information
 */
function fnCommandHelp(objCommandData, prefix, short) {
	// add arguments to strArguments
	let strArguments = "";
	Object.keys(objCommandData.args).forEach(arg => {
		strArguments += (objCommandData.args[arg]) + ", ";
	});
	strArguments = strArguments.slice(0, -2);

	let strUsage =  prefix +
		objCommandData.name +
		" " +
		strArguments;

	let strRet;

	if (short) {
		strRet = strUsage + "\n\t" + objCommandData.desc;
	} else {
		strRet = [
			"alias(es):\n\t" + objCommandData.alias.join(", "),
			"\nusage:\n\t" + strUsage,
			"\nDescription:\n" + objCommandData.desc
		].join("\n");

	}

	return strRet;
}
