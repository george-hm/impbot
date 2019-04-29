const fs = require("fs");
const modCommandList = require("./commands/index.js");
const g_objCommandTemplate = JSON.parse(fs.readFileSync("./command_list.json", "utf8"));
const g_objConfig = JSON.parse(fs.readFileSync("./config.json", "utf8"));
const modAsync = require("async");

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
		if (!objMsg.content.startsWith(strPrefix)) {
			return;
		}
		// get the actual command function from fnFetchCommand
		fnFetchCommand(objMsg.content.split(strPrefix)[1].split(" ")[0]).then(([objCommandData, fnCommand]) => {
			// going to set context later, 2 functions in the series use this
			// didnt want to use a waterfall, so initing var outside of series works
			let context;

			modAsync.series([
				function checkCommand(callback) {
					if (objCommandData.on != "message") {
						return resolve();
					}

					if (objCommandData.admin == true) {
						let bIsAdmin = fnCheckAdmin(
							g_objConfig.admins,
							objMsg,
							objCommandData,
							bot
						);

						if (!bIsAdmin) {
							return resolve(objMsg.react("⛔"));
						}
					}
					return callback();
				},
				function createContext(callback) {
					// create context to pass (this contains our args, we pass objMsg by default)
					context = {
						objMsg: objMsg,
						bot: bot,
						objCommandTemplate: g_objCommandTemplate,
						prefix: g_objConfig.prefix
					};
					// the template args
					let arrTemplateArgs = objCommandData.args;
					context = fnAssembleArgs(objMsg.content, objCommandData, context);

					return callback();
				},
				function runCommand(callback) {
					// return the command
					fnCommand(context).then(() => {
						objMsg.react("✅");
					}).catch(err => {
						if (err === "help") {
							let strComHelp = [
								"Something went wrong trying to run your command, see the help: ```md",
								fnCommandHelp(objCommandData),
								"```"
							].join("\n");
							return resolve(objMsg.reply(strComHelp));
						}
						return reject(err);
					});
				}
			]);
		}).catch(err => {
			console.log(err);
			return; //console.log(err);
		});
	});
}

/**
 * Handles commands which run on an interval
 *
 * @param      {Object}   bot     The bot instance
 * @return     {Promise}  {}
 */
module.exports.interval = bot => {
	bot.timestamp = Math.floor(Date.now() / 1000);

	return new Promise((resolve, reject) => {
		let arrToRun;
		let context = {};
		modSeries([
			function checkRuns(callback) {
				let arrToRun = bot.db.collection("interval_data").find({
					next_run: {
						$lte: bot.timestamp
					}
				}).sort({
					timestamp:-1
				}).toArray();
			},
			function buildContext(callback) {
				context.bot = bot;
				context.hm_data = {
					chat_token: objConfig.hm_data.chat_token,
					usernames: objConfig.hm_data.usernames,
					channels: objConfig.hm_data.monitor_channels
				}
			},
			function runCommands(callback) {
				//TODO: run commands
				// shouldn't need async here, we don't have to wait for each command
				for (let i = 0; i < arrToRun.length; i++) {
					let objRunData = arrToRun[i];
					context.last_run = objRunData.last_run

					fnFetchCommand(objRunData._id).then(([objCommandData, fnCommand]) => {
						fnCommand(context).then(() => {
							//TODO: update db entry for next run
						}).catch(err => {
							//TODO: update error log, also update interval_commands last_run, but NOT next_run
							return err;
						});
					}).catch(err => {
						if (err.includes("not found")) {
							//something has fucked up in the database/command list
							return console.log("Something went wrong trying to run interval command: " + objRunData._id);
						}
						return console.log(err);
					});
				}
			}
		], err => {
			//error handling
		});
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
	// add arguments to strArguments
	let strArguments = "";
	Object.keys(objCommandData.args).forEach(arg => {
		strArguments += (objCommandData.args[arg]) + ", ";
	});
	strArguments = strArguments.slice(0, -2);

	let strUsage =  g_objConfig.prefix +
		objCommandData.name +
		" " +
		strArguments;

	let arrRetFormat = [
		"alias(es):\n\t" + objCommandData.alias.join(", "),
		"\nusage:\n\t" + strUsage,
		"\nDescription:\n\t" + objCommandData.desc
	];

	return arrRetFormat.join("\n");
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
	for (let strArg = 0; strArg < strMsgContent.length; strArg++) {
		context[Object.keys(objCommandData.args)[strArg]] = strMsgContent[strArg];
	}

	return context;
}

/**
 * check if user is admin and log data
 *
 * @param      {Array}    arrAdmins       Array containing admin ids
 * @param      {Object}   objMsg          Object message from discord
 * @param      {Object}   objCommandData  Command data containing desc etc.
 * @param      {Object}   bot             The bot instance
 * @return     {boolean}  true if admin, false if not
 */
function fnCheckAdmin(arrAdmins, objMsg, objCommandData, bot) {

	let bIsAdmin = arrAdmins.includes(objMsg.author.id)

	bot.db.collection("admin_log").insertOne(
		{
			admin: bIsAdmin,
			user_id: objMsg.author.id,
			username: objMsg.author.username,
			discriminator: objMsg.author.discriminator,
			command: objCommandData.name,
			where: objMsg.channel.id,
			timestamp: bot.timestamp
		}
	);

	if (!bIsAdmin) {
		return false;
	}

	return true;
}
