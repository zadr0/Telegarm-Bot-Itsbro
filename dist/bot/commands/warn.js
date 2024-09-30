/* eslint-disable no-undef */
import { bot } from "../bot.js";
import parseDuration from "../functions/parseTime.js";
import logger from "../logger.js";
import { DateTime } from "luxon";
bot.command('warn', async (int)=>{
    console.log(1);
    const time = int.args[0];
    const reason = '';
    const target = int.msg.reply_to_message?.from;
    console.log(1);
    if (!time) return await int.reply(`Неуказанное поле со временем: ${time} [ ARG #1 ]`);
    if (!target) return await int.reply(`Ответьте на сообщение пользователя!`);
    if (target.is_bot) return await int.reply(`Пользователь являеться ботом!`);
    console.log(1);
    const msg = await int.reply(`Выполнение...`);
    const parse = DateTime.fromSeconds(Math.round(Date.now() / 1000) + parseDuration(time)).toISO();
    if (!parse || Number.isNaN(parse)) return await int.reply(`Ошибка парсирования времени!`);
    try {
        const md = await qdb.ModAsset.SavePunish(target.id.toString(), parse, reason, 'warn');
        logger.info(`Модератор: ${int.from.username} выдал предупреждение ${target.username} на: ${time}, по причине: ${reason}`);
        await bot.telegram.editMessageText(msg.chat.id, msg.message_id, '', `#${md.getDataValue("EventId")} Пользователю ${target.username} успешно выдано предудупреждение на: ${time}, по причине: ${reason}`);
    } catch (err) {
        await int.reply(`Произошла ошибка при выдаче предупреждения!`);
        logger.error(err);
    }
    ;
});
