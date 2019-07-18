const modMongo = require("mongodb").MongoClient;
const fs = require("fs");
const objConfig = JSON.parse(
	fs.readFileSync(__dirname + "../config.json", "utf8")
);
const objCommandData = JSON.parse(
	fs.readFileSync(__dirname + "../command_list.json")
);
const modAsync = require("async");

modMongo.connect(
	objConfig.db_host,
	{useNewUrlParser:true},
	(err, client) => {
		if (err) {
			return console.log(err);
		}

		db = client.db(objConfig.db_name);
		let arrToInsert = [];

		modAsync.series([
			function fnBuildData(callback) {
				modAsync.eachSeries(Object.keys(objCommandData), (command, cb) => {
					let objComData = objCommandData[command];
					if (objComData.on == "interval") {
						arrToInsert.push({
							_id: objComData.name,
							next_run: Math.floor(Date.now() / 1000),
							last_run: 0,
							interval: objComData.interval
						});
					}
					return cb();
				},
				() => {
					return callback();
				});
			},
			function fnInsertData(callback) {
				db.collection("interval_commands")
					.insertMany(arrToInsert)
					.then(data => {
						console.log(data);
						return callback();
					}).catch(err => {
						return callback(err);
					});
			}
		],
		err => {
			if (err) {
				console.log(err);
			}
			return client.close();
		});
	}
);
