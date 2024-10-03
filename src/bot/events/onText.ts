import { bot } from "../bot.js";
import logger from "../logger.js";
import { commands } from "../functions/loadEb.js"
import tg from "node-telegram-bot-api"

bot.on('text', async (ctx) => {
    const res = ctx.text;
    if (!res) return;

    const args: string[] = res.split(/ /g);
    const member = await bot.getChatMember(ctx.chat.id, ctx.from?.id as number);

    if (res.startsWith("/")) {
        try {
            const commandString = args.shift()?.toLowerCase().slice(1);
            const command = commands.get(commandString || "");

            if (command) {
                if (command.mod && !['creator', 'administator'].includes(member.status)) {
                    logger.info(`Пользователь ${ctx.from?.id} попался на ссылка!`);
                    await bot.deleteMessage(ctx.chat.id, ctx.message_id);
                };
                await command.ex(ctx, args);
            } else {
                await bot.sendMessage(ctx.chat.id, `Не нашлось команды!`);
            };

        } catch (x) {
            await bot.sendMessage(ctx.chat.id, `Произошла ошибка!`);
            logger.error(x);
        };

    } else {


        try {

            if (ctx.entities?.find(val => val.type === 'url') && !['creator', 'administator'].includes(member.status)) {
                logger.info(`Пользователь ${ctx.from?.id} попался на ссылка!`);
                await bot.deleteMessage(ctx.chat.id, ctx.message_id);
            }

        } catch (x) {
            await bot.sendMessage(ctx.chat.id, `Произошла ошибка!`);
            logger.error(x);
        }
    }
})

