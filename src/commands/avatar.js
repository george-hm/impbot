module.exports.avatar = (context) => {
	return new Promise((resolve, reject) => {
		if (!context.objMsg || !context.bot)
			return reject("help");

		console.log(Object.keys(context));
		let strAvatarURL;
		if (!context.target) {
			strAvatarURL = context.objMsg.author.avatarURL;
			return resolve(context.objMsg.reply(strAvatarURL));
		}
		else {
			context.bot.fetchUser(context.target).then(user => {
				strAvatarURL = user.avatarURL;
				return resolve(context.objMsg.reply(strAvatarURL));
			}).catch(err => {
				return reject(err);
			});
		}

	});
}
