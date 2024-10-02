import { bot } from "../bot.js";
import parseDuration from "../functions/parseTime.js";
import { createCommand } from "../functions/loadEb.js"
import logger from "../logger.js";

createCommand({
    name: `warn`,
    description: `кома`,
    async execute(msg, argums) {

        if (!argums) {
            await bot.sendMessage(msg.chat.id, `Не нашлось аргументов!`, {
                reply_to_message_id: msg.message_id,
            });
            return;
        };

        if (!msg.from) {
            await bot.sendMessage(msg.chat.id, `Вы кто?`, {
                reply_to_message_id: msg.message_id,
            });
            return;
        }

        var time: string | number = argums[0];
        var target: any = msg.reply_to_message?.from;
        var reason: string[] | string = argums.slice(1);

        if (!time) {
            await bot.sendMessage(msg.chat.id, `Ошибка аргумента времени!`, {
                reply_to_message_id: msg.message_id,
            });
            return;
        }

        if (!target) {

            try {

                target = await bot.getChatMember(msg.chat.id, Number(argums[1]));
                reason = argums.slice(2);

            } catch (x: any) {

                if (x?.response?.statusCode === 400) {
                    return await bot.sendMessage(msg.chat.id, `Не нашлось пользователя!`, {
                        reply_to_message_id: msg.message_id,
                    });
                } else {
                    logger.error(x);
                    return;
                };

            };
        };

        if (target.is_bot) {
            await bot.sendMessage(msg.chat.id, `Пользователь являеться ботом!`, {
                reply_to_message_id: msg.message_id,
            });
            return;
        };

        time = parseDuration(time);

        if (!time || Number.isNaN(time)) {
            await bot.sendMessage(msg.chat.id, `Ошибка парсивования времени!`, {
                reply_to_message_id: msg.message_id,
            });
            return;
        };

        const parse = new Date();
        parse.setSeconds(parse.getSeconds() + time);

        const md = await qdb.ModAsset.SavePunish(target.id.toString(), parse.toISOString(), reason.join(' ') || "Причина не указана!", 'warn');
        logger.info(`Модератор: ${msg.from.username} выдал предупреждение ${target.username} на: ${time}, по причине: ${reason.join(' ') || "Причина не указана!"}`)

        await bot.sendMessage(msg.chat.id, `#${md.getDataValue("EventId")} Пользователю ${target.username} успешно выдано предудупреждение на: ${time} sec, по причине: ${reason.join(' ') || "Причина не указана!"}`);


    },
})
