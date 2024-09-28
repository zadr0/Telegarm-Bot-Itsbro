import { bot } from "../bot.js";
import { MessageOnUrl, MessageOnTeleGramUrl } from "../functions/verif.js";
import logger from "../logger.js";

bot.on("message", async (ctx) => {
    const res = ctx.text;

    if (!res) return;

    const Arr = MessageOnUrl(res);

    if (Arr.length !== 0) {
        logger.warn(`User: ${ctx.from.username} triggired from links:`, Arr)
        try { await ctx.deleteMessage(ctx.msgId) } catch(err) { logger.warn("Не удалось удалить сообщения от пользователя! Ошибка:", err) };
    };
});