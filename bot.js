const {Client, SnowflakeUtil} = require("discord.js");
const bot = new Client();
let rp = require("request-promise"); // used to get the data
let fs = require("fs");

let config_data = JSON.parse(fs.readFileSync("./config.json", "utf8"));
const prefix = config_data.prefix;
const admin = config_data.admin_id;
const chat_token = config_data.chat_token;
const hm_username = config_data.hm_username;

let last_time = new Date() / 1000;


bot.on("ready", () => {
	console.log("logged in as " + bot.user.tag);
	bot.user.setActivity(prefix+"help");
});

bot.on("message", msg => {
	let com = msg.content.split(prefix)[1];
	if (com)
		com = com.split(" ")[0];

	if (msg.content.startsWith(prefix)) {
		console.log(msg.author.username + "#" + msg.author.discriminator + " => " + msg.content);
		//ADMIN COMMANDS
		if (msg.author.id == admin) {
			switch (com) {
				case "sendasbot":{
					let target = msg.content.split(" ")[1];
					let target_message = msg.content.split(" ").slice(2).join(" ");
					bot.fetchUser(target).then(user => {
						user.createDM().then(ch => {
							ch.send(target_message);
							msg.react("✅");
						}).catch(err =>{
							console.log(err);
						});
					}).catch(() => {
						msg.reply("Cannot find user.");
					});
					break;
				}
				case "delete": {
					let amount = parseInt(msg.content.split(" ")[1]);
					if (isNaN(amount)) 
						return msg.reply("usage: " + prefix + "delete <number>");
						
					msg.reply("Deleting " + amount + " messages");
					msg.channel.fetchMessages({limit:amount + 1}).then(to_delete => {
						to_delete.deleteAll();
						msg.reply("Deleted " + amount + " messages.");
					});
					break;
				}
				case "send": {
					let rp = require("request-promise");
					let target = msg.content.split(" ")[1];
					let ch_or_te = "channel";
					let pos_channels = ["0000"];
					if (!pos_channels.includes(target))
						ch_or_te = "tell";
					let msg_to_send = msg.content.split(" ").slice(2);
					let options = { // request-promise options, used for hackmud api to get data
						url:"https://www.hackmud.com/mobile/create_chat.json",
						method:"POST",
						headers: {
							"Content-Type": "application/json"
						},
						body: {
							chat_token: chat_token,
							username: hm_username,
							[ch_or_te]: target,
							msg: msg_to_send.join(" ")
						},
						json:true
					};

					rp(options).then(() => {
						msg.react("✅");
					}).catch(() => {
						msg.reply("Message failed to send. Channel may not exist.");
					});
					break;
				}
				case "eval": {
					let eres;
					try {
						eres = eval(msg.content.split(" ").slice(1).join(" "));
					} catch (err) {
						eres = err;
					}
					msg.reply("**OUTPUT**:```js\n" + eres + "```");
					break;
				}
				case "snowflake": {
					let sf = msg.content.split(" ").pop();
					bot.fetchUser(sf).then(user => {
						msg.reply("Snowflake info for: " + user.username + "#" + user.discriminator +  "```js\n" + JSON.stringify(SnowflakeUtil.deconstruct(sf), null, 2) + "```");
					});
					break;
				}
				default:
					break;
			}
		}

		// ANYONE COMMANDS
		switch (com) {
			case "play": {
				let args = msg.content.split(" ").slice(1).join(" ");
				if (!msg.guild) return;

				if (!args || !msg.member.voiceChannel) return msg.reply("usage: " + prefix + "play <url or search term>");

				msg.channel.startTyping();
				if (!args.startsWith("http")) {
					const {google} = require("googleapis");
					const yt = google.youtube({
						version:"v3", 
						auth: config_data.g_api_key
					});
					let url = "https://www.youtube.com/watch?v=";
					yt.search.list({
						part:"snippet",
						q: args,
					}).then(data => {
						for(let x = 0; x < data.data.items.length; x++) {
							if (data.data.items[x].id.kind == "youtube#video") {
								url = url + data.data.items[x].id.videoId;
								break;
							}
						}
						if (!url.split("/watch?v=")[1]) {
							console.log(url);
							msg.channel.stopTyping();
							msg.reply("cannot find video.");
							return;
						}
						playVideo(url, msg);
					}).catch(err => {
						console.log(err);
						return;
					});
				} else {
					playVideo(args, msg);
				}

				break;
			}
			case "stop": {
				bot.voiceConnections.map(x => x.disconnect());
				msg.reply("stopped streaming.");
				break;
			}
			case "ping": {
				msg.reply("Pong! Reponse time: " + bot.ping.toFixed(0) + "ms");
				break;
			}
			case "help": {
				let help_dialogue = [
					"**COMMANDS**",
					"```",
					prefix + "help - you are here.",
					prefix + "ping - get a response time from the bot.",
					prefix + "uptime - see how long the bot has been running.",
					prefix + "avatar - get your avatar URL.",
					prefix + "play <search term or url> - play youtube audio into the voice channel you are in.",
					prefix + "stop - stops the bot from broadcasting audio and leave the current voice channel.",
					"```"
				];
				let admin_help = [
					"**ADMIN COMMANDS**",
					"```",
					prefix + "sendasbot <user id> <message> - send a direct message to a user via the bot",
					prefix + "delete <num> - delete an amount of messages",
					prefix + "send <channel or user> <message> - send a hackmud chats.tell or chats.send message",
					prefix + "eval <code> - run eval command [DANGEROUS]",
					prefix + "snowflake <user id> - get snowflake info on a user.",
					"```"
				];

				if (msg.author.id == admin)
					help_dialogue = help_dialogue.concat(admin_help);

				
				// using msg.reply in case dms are disabled
				msg.reply(help_dialogue);
				
				// msg.author.createDM().then(dm => {
				// 	dm.send(help_dialogue.join("\n"));
				// });
				msg.react("✅");
				break;
			}
			case "uptime": {
				let time = bot.uptime / 1000;
				msg.reply("Uptime is " + time.toFixed(0) + " seconds.");
				break;
			}
			case "avatar": {
				msg.reply(msg.author.avatarURL);
				break;
			}
			default:
				break;
		}
	}

	if (msg.channel.type == "dm") {
		let recipient = msg.channel.recipient.username + "#" + msg.channel.recipient.discriminator;
		if (msg.author.id != bot.user.id) // the bot id
			recipient = bot.user.username + "#" + bot.user.discriminator;

		console.log(msg.author.username + "#" + msg.author.discriminator + " => " + recipient + ": " + msg.content);
	}

});

bot.on("guildMemberAdd", mem => {
	console.log(mem.username + "#" + mem.discriminator + " has joined " + mem.guild.name);
	const channel = mem.guild.channels.find(c => c == "general");
	let greeting =  "@" + mem.user.username + "has connected. Welcome to the server!\n";

	if (channel)
		channel.send(greeting.join("\n"));
});

// run monitorMessages every 10 seconds
bot.setInterval(monitorMessages, 10000, ["0000"], ["544630518268952587"]);
bot.setInterval(sendAd, 300000, "0000");

//monitor hackmud messages
function monitorMessages(which_channels, post_where) { 
	// which channels do you want to gather from 
	// and which channel are they going to be posted to
	let ret_data = {}; // setting up an object to store our data
	for (let x = 0; x < which_channels.length; x++) { // go through channel array
		ret_data[which_channels[x]] = { // create a new property which is an object
			direction: post_where[x],  // insert its destination as a property
			chats:[] // used to store our messages (may have more than one)
		};
	}

	let options = { // request-promise options, used for hackmud api to get data
		url:"https://www.hackmud.com/mobile/chats.json",
		method:"POST",
		headers:{
			"Content-Type": "application/json"
		},
		body:{
			chat_token: chat_token,
			after: last_time,
			usernames: [hm_username]	
		},
		json:true
	};

	rp(options).then(data => {
		let ch = data.chats[hm_username]; // get the message data
		let date, hours, minutes, to_app, message_setup; // init vars

		ch.forEach(chat_message => { // go through each message data
			date = new Date(chat_message.t*1000); // message timestamp (ruby timestamp is js timestamp / 1000)
			hours = ("00" + date.getUTCHours()).slice(-2); // hours (hackmud style)
			minutes = ("00" + date.getUTCMinutes()).slice(-2); // minutes (hackmud style)

			if (!chat_message.channel) // if missing then its a chats.tell
				chat_message.channel = "[TELL]";

			// setup message formatting
			message_setup = hours + minutes + " " + chat_message.channel + " " + chat_message.from_user + " ::: " + chat_message.msg;
			
			// this is a tell, send a dm to me
			if (chat_message.channel == "[TELL]" || chat_message.msg.match(new RegExp("@" + hm_username, "g"))) {
				// fetch user data
				bot.fetchUser("129416238916042752").then(user => {
					// create a dm with that user data
					user.createDM().then(ch => {
						// send the message
						message_setup = ("```" + message_setup.replace(/`[A-Za-z0-9]|`/g, "") + "```");
						ch.send(message_setup);
					});
				});
			} 
			// if chat channel is a channel we want to gather
			else if (chat_message.channel in ret_data) {
				// append the chat data
				to_app = ret_data[chat_message.channel].chats;
				to_app.push(message_setup);
			}
		});

		last_time = new Date() / 1000; // update last time so we only get new messages

		let channels = []; // channel array to insert channel classes into
		let messages; // represents the messages to send
		post_where.forEach(x => { // go through each post_where id
			let c = bot.channels.find(ch => ch.id == x); // get the channel data
			if (c) // if the channel exists, push it
				channels.push(c);
		});

		for (let i = 0; i < channels.length; i++) { // go through these channels
			messages = ret_data[which_channels[i]].chats; // get the chats we collected
			if (messages.length != 0) { // if we actually collected chats
				// clean messages
				messages = messages.map(x => "```" + x.replace(/`[A-Za-z0-9]|`/g, "") + "```");
				messages.join(" "); // join everything to send
				channels[i].send(messages); // send it
			}
		}
	}).catch(err => {
		console.log(err);
	});
}

function sendAd(where) {
	let ads = [
		[
			"implink",
			[
				"\n     `Pp`                  `Pp`         `Pp`",
				"    `B/\\`     `Pp`      `Pp`    `B/\\`        `B/\\`",
				"   `B/__\\`   `B/\\``B_____``B/\\`   `B/__\\`      `B/__\\`    ",
				"   `B|. |_=_|. . . .|_=_=_=_=_=_=_|. |`    ",
				"   `B|. |. .|  ___  |. . . . . . .|. |`    ",
				"   `B|. |   | |   | |             |. |`    ",
				" `L__``B|__|``L___``B|_|``b___``B|_|``L_____________``B|__|``L__`",
				"`B/`          `b/`   `b/`  `Fimplink``A.``Lcastle`      `B\\` "  ,     
				"WE TRUTHWORTH - start securing your GC & upgrades today."   
			].join ("\n")
		],
		[
			"magma",
			[
				"\n      `D,*-'.`",
				"      `D.'+*`",
				"    `D'   #   '`",
				"`E       /v\\`  magma.bank",
				"`E     ,'  . ,`",
				"`E__.-\"  ^    \"-.__`\nOur corp works their best\nto keep our bank secure."
			].join("\n")
		]
	];
	let selection = ads[Math.floor(Math.random() * ads.length)];
	let options = { // request-promise options, used for hackmud api to get data
		url:"https://www.hackmud.com/mobile/create_chat.json",
		method:"POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: {
			chat_token: chat_token,
			username: selection[0],
			channel: where,
			msg: selection[1]
		},
		json:true
	};
	

	rp(options).then(() => {}).catch(err => {
		console.log(err);
		console.log("ERR: Failed to send chat message. User not in channel?");
	});
}

function playVideo(url, msg) {
	msg.channel.stopTyping();
	msg.member.voiceChannel.join().then(connection => {
		let ytdl = require("ytdl-core");
		let time = 0;
		msg.reply("attempting to play " + url);
		if (url.includes("?t="))
			time = url.split("?t=").pop();
		url = ytdl(url, {filter:"audioonly"});
		const disp = connection.playStream(url, {seek:time, volume:0.25});

		disp.on("error", err => {
			console.log(err);
		});

		disp.on("end", () => {
			// connection.disconnect();
		});
	}).catch(err => {
		console.log(err);
	});
}

bot.login(config_data.bot_token);
