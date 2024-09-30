import { bot } from "../bot.js";
import { MessageOnUrl } from "../functions/verif.js";
import logger from "../logger.js";
bot.on("message", async (ctx)=>{
    const res = ctx.text;
    if (!res) return;
    const Arr = MessageOnUrl(res);
    const ss = (await bot.telegram.getChatMember(ctx.chat.id, ctx.from.id)).status;
    if (!(ss in [
        'creator',
        'administator'
    ]) && Arr.length) {
        logger.warn(`User: ${ctx.from.username} triggired from links:`, Arr);
        try {
            await ctx.deleteMessage(ctx.msgId);
        } catch (err) {
            logger.warn("Не удалось удалить сообщения от пользователя! Ошибка:", err);
        }
        ;
    }
    ;
});
