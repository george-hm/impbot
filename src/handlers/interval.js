import fs from "fs";
import commandList from "../commands";
const templates = JSON.parse(fs.readFileSync(__dirname + "/../configs/command_list.json", "utf8"));
const config = JSON.parse(fs.readFileSync(__dirname + "/../configs/config.json"));

export default async bot => {
	const cache = bot.cache;
	const context = {
		hm_data: config.hm_data
	};

	if (!Object.keys(cache).length) {
		populateCache(cache);
	}

	for (const key in cache) {
		const com = cache[key];
		const runTime = Date.now() / 1000;
		if ((com.last_run - runTime) < com.interval) {
			continue;
		}

		context.last_run = runTime;
		commandList[key].main(context);
		cache[key].last_run = Date.now()/1000;
	}
};

/**
 * Populates the cache, with all interval commands
 *
 * @param {Object} cache Cache to populate
 */
function populateCache(cache) {
	for (let i = 0; i < templates.length; i++) {
		const currentTemplate = templates[i];
		if (currentTemplate.on != "interval") {
			continue;
		}
		cache[currentTemplate.name] = {
			interval: currentTemplate.inveral,
			last_run: 0
		};
	}
}
