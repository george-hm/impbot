import {MongoClient as mongo} from "mongodb";

class Database {

	/**
	 * Connect to a mongodb database
	 *
	 * @param {String} host    The host to connect to
	 * @param {String} dbName  The name of the database to use
	 * @static
	 * @returns {Object}       Database connection
	 * @memberof Database
	 */
	static async connect(host, dbName) {
		try {
			this._db = await mongo.connect(
				host,
				{useNewUrlParser:true}
			);

			this._dbName = dbName;
		} catch (err) {
			throw err;
		}
	}

	/**
	 * Get the current database connection
	 *
	 * @static
	 * @returns
	 * @memberof Database
	 */
	static get(colName) {
		if (!this._db) {
			return undefined;
		}
		return this._db.db(this._dbName).collection(colName);
	}

	/**
	 * Close the database connection
	 *
	 * @static
	 * @memberof Database
	 */
	static async disconnect() {
		if (!this._db) {
			return;
		}

		await this._db.close();
	}
}

export default Database;
