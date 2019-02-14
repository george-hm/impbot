# Impbot

Basic discord bot using discord.js

Features include:
- sending direct messages (dms) as the bot to other users. (admin only)
- delete a number of messages (admin only)
- search and play youtube audio
- uptime
- ping
- return user avatar
- welcome message
- Direct message/command logging
- hackmud chat API support 
	- gathering channel text
	- notifying of @'s and tells
	- send messages as user
	- periodically post advertisements

## Setup
- run `npm install` from a terminal
- run `get_token.js` to get your hackmud chat token
- use `config_example.json` to setup your credentials and rename to `config.json`

hackmud API:
- edit `ads` within `sendAd` function to configure advertisements to send
- edit `pos_channels` within `send` command to be able to send messages to more channels

## You need:
- node
- npm
- hackmud chat_token
- discord bot token
- google api key