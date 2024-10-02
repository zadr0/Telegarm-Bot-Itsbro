import schedule from "node-schedule";
import { Op } from "sequelize";
import { models } from "../../database/sequalize.js";
import { bot } from "../bot.js";
import logger from "../logger.js";
import { condition as cond } from './condition.js';
export var PunishManager;
(function(PunishManager) {
    PunishManager.jobs = new Map();
    async function Initilize() {
        const mutes = await models.ModModel.findAll({
            where: {
                punish: 'mute'
            }
        });
        mutes.forEach((mute)=>scheduleMute(mute));
    }
    PunishManager.Initilize = Initilize;
    function scheduleMute(Punish) {
        const job = schedule.scheduleJob(Punish.expired, ()=>UnmuteUser(Number(Punish.userId), Number(Punish.chatId)));
        PunishManager.jobs.set(Punish.userId, job);
    }
    PunishManager.scheduleMute = scheduleMute;
    async function UnmuteUser(id, chatId, reason = 'system') {
        await bot.restrictChatMember(chatId, id, {
            can_send_messages: true
        });
        logger.info(`Пользователь: ${id} был размучен по причине: ${reason}`);
    }
    PunishManager.UnmuteUser = UnmuteUser;
    async function MuteUser(id, chatId, time, reason = 'причина не указана') {
        await bot.restrictChatMember(chatId, id, {
            can_send_messages: false
        });
        const parse = new Date();
        parse.setSeconds(time);
        await qdb.ModAsset.SavePunish(id.toString(), parse.toISOString(), reason, 'mute');
        logger.info(`Пользователь: ${id} был замучен по причине: ${reason}`);
    }
    PunishManager.MuteUser = MuteUser;
    async function BanUser(id, chatId, until, reason = 'причина не указана') {
        await bot.banChatMember(chatId, id, {
            until_date: until
        });
        logger.info(`Пользователь: ${id} был забанен по причине: ${reason}`);
    }
    PunishManager.BanUser = BanUser;
    async function WarnUser(id, chatId, time, reason = 'причина не указана') {
        const md = await models.ModModel.create({
            userId: id,
            expired: time,
            punish: 'warn',
            chatId: chatId
        });
        return md;
    }
    PunishManager.WarnUser = WarnUser;
    async function SaveCondition(id, where, chatId) {
        const conditions = cond[where];
        const summary = await models.ModModel.findAll({
            where: {
                userId: id.toString(),
                punish: where,
                expired: {
                    [Op.gt]: new Date()
                }
            }
        });
        switch(where){
            case "warn":
                const summaryWarns = reduxWarns(summary?.length);
                for(const condition in conditions){
                    if (Number(condition) !== summaryWarns) continue;
                    const c = conditions[summaryWarns];
                    await MuteUser(id, chatId, c.time, `#${summaryWarns} предупреждение`);
                }
                ;
                break;
            case "mute":
                var until_date = Date.now();
                const summaryMutes = reduxMutes(summary?.length);
                for(const condition in conditions){
                    if (Number(condition) !== summaryMutes) continue;
                    const c = conditions[summaryMutes];
                    await BanUser(id, chatId, until_date + c, `#${summaryMutes} мутов`);
                }
                ;
                break;
            default:
                return;
        }
        ;
    }
    PunishManager.SaveCondition = SaveCondition;
})(PunishManager || (PunishManager = {}));
function reduxWarns(num) {
    let res = num;
    while(num > 7){
        num -= 7;
    }
    ;
    return res;
}
function reduxMutes(num) {
    let res = num;
    while(num > 10){
        res -= 10;
    }
    ;
    return res;
}
