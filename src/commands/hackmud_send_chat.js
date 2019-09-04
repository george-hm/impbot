import axios from "axios";

/**
 * Send a message to a channel in hackmud
 *
 * @param {*} context
 */
const main = async context => {
    if (
        !context.username ||
        !context.channel ||
        !context.hmsg
    ) {
        throw "help";
    }

    try {
        await axios(
            {
                url: "https://www.hackmud.com/mobile/create_chat.json",
                method: "POST",
                headers: {
                    "content-type": "application/json"
                },
                data: {
                    chat_token: context.chat_token,
                    username: context.username,
                    channel: context.channel,
                    msg: context.hmsg
                }
            }
        );
    } catch (err) {
        context.msg.reply(
            "Something went wrong. Response from hackmud: \n```js\n" +
            JSON.stringify(err.response.data, null, 2) +
            "```"
        );
    }
};

export default {main};
