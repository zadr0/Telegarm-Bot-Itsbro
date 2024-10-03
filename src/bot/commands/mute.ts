import { bot } from "../bot.js";
import parseDuration from "../functions/parseTime.js";
import { createCommand } from "../functions/loadEb.js"
import logger from "../logger.js";
import { PunishManager } from "../task/UpdatePunish.js";
import Tg from "node-telegram-bot-api"
createCommand({
    name: `mute`,
    description: ``,
    moderation: true,
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
        };

        var time: any = argums[0];
        var target: Tg.User | undefined = msg.reply_to_message?.from;
        var reason: string[] = argums.slice(1);

        if (!time) {
            await bot.sendMessage(msg.chat.id, `Ошибка аргумента времени!`, {
                reply_to_message_id: msg.message_id,
            });
            return;
        };

        if (!target) {

            try {

                const member = (await bot.getChatMember(msg.chat.id, Number(argums[1])));
                reason = argums.slice(2);

                if (!member.can_send_messages) {
                    return await bot.sendMessage(msg.chat.id, `Пользователь уже в муте!`, {
                        reply_to_message_id: msg.message_id,
                    });
                };

                target = member.user;

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

        const res = await PunishManager.MuteUser(target.id, msg.chat.id, time, reason.join(' '));

        if (!res) {
            await bot.sendMessage(msg.chat.id, `Произошла ошибка при выдаче мута!`);
            return;
        };

        await bot.sendMessage(msg.chat.id, `#${res.EventId} Пользователь был замьючен на: ${time}sec, по причине: ${res.reason}`, {
            reply_to_message_id: msg.message_id,
        })
    },
})

