/**
 * returns help of call commands or only one command
 *
 * @param      {Object}   context  The context
 * @return     {Promise}  { description_of_the_return_value }
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
			"```md",
			"####################\n"
		]
		for (let strCommand in context.objCommandTemplate) {
			let strComHelp = fnCommandHelp(context.objCommandTemplate[strCommand], context.prefix);

			arrCommandHelpSummary.push(
				"- " + strCommand + 
				":\n" + strComHelp + 
				"\n\n####################\n"
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
 * @return     
 */
function fnCommandHelp(objCommandData, prefix) {
	// add arguments to strArguments
	let strArguments = "";
	Object.keys(objCommandData.args).forEach(arg => {
		strArguments += objCommandData.args[arg];
	});
	let strFirstDesc = objCommandData.desc[0]
		.replace("{PREFIX}", prefix)
		.replace("{ARGS}", strArguments);

	let arrRetFormat = [
		"alias(es):\n\t" + objCommandData.alias.join(" "),
		"\nusage:\n\t" + strFirstDesc,
		"\nDescription:\n" + objCommandData.desc[1]
	];

	return arrRetFormat.join("\n");
}

