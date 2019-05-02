const rq = require("request-promise");
const modAsync = require("async");

/**
 * Monitors channels in hackmud
 *
 * @param      {object}   context  Bot instance, hackmud data etc.
 * @return     {Promise}
 */
module.exports = (context) => {
	return new Promise((resolve, reject) => {
		let objOptions = {
			url: null,
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: {
				chat_token: context.hm_data.chat_token,
				json:true
			}
		};

		modAsync.waterfall([
			/**
			 * Find a user in a channel which we want to monitor
			 *
			 * @param      {Function}  callback  The callback
			 */
			function getChannelLocations(callback) {
				objOptions.url = "https://www.hackmud.com/mobile/account_data.json";

				rp(objOptions).then(objResponse => {
					// the user data, this contains the usernames and channels within them
					let objUsers = objResponse.users;
					// the channels we are looking to monitor
					let to_monitor = context.monitor_channels;
					// we are going to map the channel locations here e.g.
					// {
					// 	"0000":["implink"]
					// }
					let channel_locations = {};

					Object.keys(objUsers).forEach(user => {
						// if this user isn't in this response then skip
						if (!context.hm_data.usernames.includes(user)) {
							return;
						}

						// this gets us an array of channels this user is in
						let user_channel_list = Object.keys(objUsers[user]);

						// does this user have the channel we need?
						// if so, say this user has it
						for (let x = 0; x < to_monitor.length; x++) {
							let location = user_channel_list.indexOf(to_monitor[x]);
							if (location != -1) {
								if (!channel_locations[to_monitor[x]]) {
									channel_locations[to_monitor[x]] = [];
								}

								channel_locations[to_monitor[x]].push(user);
							}
						}
					});

					if (Object.keys(channel_locations).length == 0) {
						return callback("No channels to monitor");
					}

					return callback(null, channel_locations);
				});
			},
			function weighUsers(channel_locations, callback) {
				// should we be weighing?
				// need to think of a smart way to do this
			},
			function getMessages(channel_locations, callback) {
				objOptions.url = "https://www.hackmud.com/mobile/chats.json";

				rp(objOptions).then(objResponse => {
					let chats = objResponse.chats;

					//TODO: get chat messages
				});
			}
		],
		function(err, result) {
			if (err) {
				return reject(err);
			}
		});
	});
}