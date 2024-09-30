import { bot } from "../bot.js";
bot.command('warn', async (int)=>{
    const target = int.args[0];
    const user = int.from;
    await int.reply(`${user} ${target}`);
});
