import { bot } from "../bot.js";
import parseDuration from "../functions/parseTime.js";
import logger from "../logger.js";

bot.command('warn', async (int) => {
    const time = int.args[0];
    const reason = int.args[1] ?? "без причины";
    const target = int.msg.reply_to_message?.from

    if (time || target) {
        return (await int.reply(`Неуказанное поле со временем: ${time} [ ARG #1 ]`))
    }

    const parse = parseDuration(time);

    try {

    } catch (err) {
        logger.error(err);
    }

    await int.reply(`svo`);
})