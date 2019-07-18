/**
 * Returns the users or a users avatar
 *
 * @param      {object}   context  The context, we get various info form here
 * @return     {Promise}
 */
module.exports.main = async (context) => {
	if (!context.msg || !context.bot)
		throw "help";

	let strAvatarURL;
	if (!context.target) {
		strAvatarURL = context.msg.author.avatarURL;
		return context.msg.reply(strAvatarURL);
	}
	try {
		let user = await context.bot.fetchUser(context.target);
		if (!user.avatarURL) {
			return context.msg.reply("That user does not have a profile picture.");
		}

		strAvatarURL = user.avatarURL;
		return context.msg.reply(strAvatarURL);

	} catch(err) {
		if (err.message === "Unknown User") {
			return context.msg.reply("Unknown User");
		}
		throw err;
	}
};
