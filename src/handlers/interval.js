const fs = require("fs");
const commandList = require(__dirname + "/../commands");
const templates = JSON.parse(fs.readFileSync(__dirname + "/../command_list.json", "utf8"));

module.exports = async bot => {
	let cache = bot.cache;
	let toLookup = [];

	// fetch commands to lookup if not in cache
	for (let i = 0; i < templates.length; i++) {
		const templateData = templates[i];
		const name = templateData.name;
		if (templateData.on != "interval" || checkCache(cache, name)) {
			continue;
		}

		toLookup.push(name);
	}


};

/**
 * Looks at the cache, and returns data from it (or undefined)
 *
 * @param {Object} cache    The cache
 * @param {String} toFetch  What to get from the cache
 * @returns 				Either cache data or undefined
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
