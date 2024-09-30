import { bot } from "../bot.js";
import { Telegram } from "telegraf"

bot.command('warn', async (int) => {
    const target = int.args[0]
    const user = int.from;
    await int.reply(`${user} ${target}`);
})