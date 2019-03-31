

/**
 * returns help of call commands or only one command
 *
 * @param      {<type>}   context  The context
 * @return     {Promise}  { description_of_the_return_value }
 */
module.exports.help = (context) => {
	return new Promise((resolve, reject) => {
		if (!context.objCommandTemplate) {
			return reject("Missing required data context.objCommandTemplate");
		}

		if (context.command) {
			let objCommandData = context.objCommandTemplate[context.command];
			if (objCommandData) {
				return resolve(context.objMsg.reply(fnCommandHelp(objCommandData, context.objConfig)));
			}

			return resolve(context.objMsg.reply("Command does not exist."));
		}

		let arrCommandHelpSummary = [
			"```md",
			"COMMANDS:"
		]
		for (let strCommand in context.objCommandTemplate) {
			let strComHelp = fnCommandHelp(context.objCommandTemplate[strCommand], context.objConfig, true);

			arrCommandHelpSummary.push(
				strCommand + " usage:\n" +
				"- " + strComHelp + "\n"
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
function fnCommandHelp(objCommandData, objConfig, desc_only) {
	console.log(objConfig);
	if (desc_only) {
		return objCommandData.desc[1];
	}
	let strDescToReplace = objCommandData.desc[0];
	strDescToReplace.replace("{PREFIX}", objConfig.prefix);
	let arrArgs = [];
	for (let strArg in objCommandData) {
		arrArgs.push(objCommandData[strArg]);
	}
	strDescToReplace.replace("{ARGS}", arrArgs.join(" "));

	return strDescToReplace + "\n" + objCommandData.desc[1];	
}

