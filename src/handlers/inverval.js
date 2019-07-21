const fs = require("fs");
const commandList = require(__dirname + "/../commands");
const template = JSON.parse(fs.readFileSync(__dirname + "/../command_list.json", "utf8"));

module.exports = async (bot) => {
	let toLookup = [];

	for (let i = 0; i < templates.length; i++) {
		const commandData = templates[i];
		const name = commandData.name;
		if (commandData.on != "interval") {
			continue;
		}

		// if our command is missing from the cache
		if (checkCache(bot.cache, name)) {
			continue;
		}

		toLookup.push(name);
	}
};

/**
 * Looks at the cache, and returns data from it (or undefined)
 *
 */
function checkCache(cache, toFetch) {
	for (let i = 0; i < cache.length; i++) {
		const cacheData = cache[i];
		if (cacheData.name === toFetch) {
			return cacheData;
		}
	}
	return undefined;
}
