import { bot } from "../bot.js";
import { MessageOnUrl } from "../functions/verif.js";
import logger from "../logger.js";
bot.on("message", async (ctx)=>{
    const res = ctx.text;
    if (!res) return;
    const Arr = MessageOnUrl(res);
    logger.info(Arr);
    if (Arr.length !== 0) {
        await ctx.reply("это смерть");
    } else {
        await ctx.reply("живи");
    }
});
