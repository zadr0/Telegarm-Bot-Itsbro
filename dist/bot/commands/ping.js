import { bot } from "../bot.js";
bot.command('ping', async (ctx)=>{
    await ctx.reply("pong!");
});
