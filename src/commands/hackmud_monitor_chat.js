import axios from "axios";

/**
 * Monitor a hackmud channel, dumping the data to a discord channel
 *
 * @param {*} context
 */
const main = async context => {
    if (
        !context ||
        !context.hm_data ||
        !context.hm_data.channel ||
        !context.hm_data.chat_token
    ) {
        throw new Error("No hackmud data, cannot monitor channel");
    }

    try {
        const result = await axios({
            url: "https://hackmud.com/mobile/chats.json",
            headers: {
                "content-type": "application/json"
            },
            data: {
                chat_token: context.hm_data.chat_token
            }
        });

    } catch (err) {
        // don't really want to throw here
        console.log(err);
    }

};

export default main;
