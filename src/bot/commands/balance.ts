import { bot } from "../bot.js";
bot.command('balance', async (ctx) => {
    const value = await qdb.EconomyAsset.getJSON(ctx.from.id.toString());
    await ctx.reply(`hi: ${value.userId}, value: ${value.value}`);
});