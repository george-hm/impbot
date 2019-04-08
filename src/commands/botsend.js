module.exports = (context) => {
	return new Promise((resolve, reject) => {
		if (!context.target || !context.message){
			return reject("help");
		}

		context.bot.fetchUser(context.target).then((user, err) => {
			if (err) {
				let user = context.objMsg.mentions.users.array()[0];
				if (!user) {
					return err;
				}
				return resolve(user.send(context.message));
			}
			
			user.createDM().then(dmChannel => {
				return resolve(dmChannel.send(context.message));
			});
		}).catch(err => {
			if (err.message === "Unknown User") {
				let channel = context.bot.channels.get(context.target);
				if (!channel || !channel.send) {
					return resolve(context.objMsg.reply("Couldn't find channel or user by ID."));
				}
				return resolve(channel.send(context.message));
			}
			let user = context.objMsg.mentions.users.array()[0];
			if (user) {
				return resolve(user.send(context.message));
			}
			return reject(err);
		});
	});
}
