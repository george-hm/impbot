const main = async (context) => {
	if (!context.target || !context.message){
		throw "help";
	}

	try {
		const user = await context.bot.fetchUser(context.target);
		const dmChannel = await user.createDM();

		return dmChannel.send(context.message);
	} catch (err) {
		if (err.message.includes("is not snowflake")) {
			const channel = context.bot.channels.get(context.target);
			if (!channel || !channel.send) {
				return context.msg.reply("Couldn't find channel or user by ID.");
			}
			return channel.send(context.message);
		}

		const user = context.msg.mentions.users.array()[0];
		if (user) {
			return user.send(context.message);
		}
		console.log(err);
		throw err;
	}
};

export default {main};
