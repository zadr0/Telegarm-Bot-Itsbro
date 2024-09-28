import { bot } from "../bot.js";
bot.command('balance', async (ctx)=>{
    ctx.sendGame('', {});
    await ctx.reply(`hi: , value: `);
});
