module.exports.avatar = (context) => {
	return new Promise((resolve, reject) => {
		if (!context.objMsg || !context.bot)
			return reject("help");

		let strAvatarURL;
		if (!context.target) {
			strAvatarURL = context.objMsg.author.avatarURL;
			return resolve(context.objMsg.reply(strAvatarURL));
		}
		else {
			// get user to acquire avatar url
			context.bot.fetchUser(context.target).then(user => {
				if (!user.avatarURL) {
					return resolve(context.objMsg.reply("That user does not have a profile picture."))
				}
				strAvatarURL = user.avatarURL;
				return resolve(context.objMsg.reply(strAvatarURL));
			}).catch(err => {
				if (err.message === "Unknown User") {
					return resolve(context.objMsg.reply("Unknown User"))
				}
				return reject(err);
			});
		}
	});
}
