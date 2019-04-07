module.exports = (context) => {
	return new Promise((resolve, reject) => {
		if (!context.target || !context.message)
			return reject("help");

		context.bot.fetchUser(context.target).then(user => {
			user.createDM().then(dmChannel => {
				return resolve(dmChannel.send(context.message));
			}).catch(err => {
				return err;
			});
		}).catch(err => {
			
		});
	});
}
