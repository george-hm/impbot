const database = require(__dirname + "/database.js");
const fs = require("fs");
const config = JSON.parse(fs.readFileSync(__dirname + "/../config.json", "utf8"));
const userCollection = "users";
const adminCollection = "admin_log";

class User {

    constructor(msg) {
        this._id = msg.author.id;
        this._username = msg.author.username;
        this._discrim = msg.author.discriminator;
        this._msg = msg;
    }

    /**
     * Saves some useful data to the dababase
     *
     * @memberof User
     */
    async save() {
        let db = database.get(userCollection);
        if (!db) {
            return;
        }

        try {
            let channel = this._msg.channel;
            await db.updateOne(
                {_id:this.getId()},
                {
                    $set: {
                        username: this.getUsername(),
                        discriminator:this.getDiscrim()
                    },
                    $push: {
                        message: {
                            content:this._msg.content,
                            timestamp: Math.floor(Date.now()),
                            where: channel.id
                        }
                    }
                },
                {upsert:true}
            );
        } catch (err) {
            throw "Database: " + err;
        }
    }

    /**
     * Saves data to the admin log
     * console logs if a user isn't admin
     *
     * @param {String} command  The command used
     * @returns
     * @memberof User
     */
    async adminLog(command) {
        if (!this.isAdmin()) {
            console.log(
                this.getUsername() +
                this.getDiscrim() +
                " attempted to use admin command: " +
                command
            );
        }
        let db = database.get(adminCollection);
        if (!db) {
            return;
        }

        try {
            let channel = this._msg.channel;
            await db.updateOne(
                {_id:this.getId()},
                {
                    $set: {
                        admin: this.isAdmin()
                    },
                    $push: {
                        message: {
                            command: command,
                            content:this._msg.content,
                            timestamp: Math.floor(Date.now()),
                            where: channel.id
                        }
                    }
                },
                {upsert:true}
            );
        } catch (err) {
            console.log("Database: " + err);
        }
    }

    getId() {
        return this._id;
    }

    getUsername() {
        return this._username;
    }

    getDiscrim() {
        return this._discrim;
    }

    /**
     * Checks if the user is an admin
     *
     * @returns {Boolean} True if admin - false if not
     * @memberof User
     */
    isAdmin() {
        let id = this.getId();
        return id.includes(config.admins);
    }
}

module.exports = User;
