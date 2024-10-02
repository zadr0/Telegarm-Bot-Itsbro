import schedule from "node-schedule";
import type { condition, EventPunish, } from "../../../types/DataTypes";
import { Op, type Model } from "sequelize"
import { models } from "../../database/sequalize.js";
import { bot } from "../bot.js";
import logger from "../logger.js";
import { condition as cond } from './condition.js';

export namespace PunishManager {
    export const jobs = new Map<string, any>()

    export async function Initilize(): Promise<void> {
        const mutes = await models.ModModel.findAll({
            where: {
                punish: 'mute',
            },
        });

        mutes.forEach(mute => scheduleMute(mute as Model<any, any> & EventPunish));
    };

    export function scheduleMute(Punish: Model<any, any> & EventPunish): void {
        const job = schedule.scheduleJob(Punish.expired, () => UnmuteUser(Number(Punish.userId), Number(Punish.chatId)));
        jobs.set(Punish.userId, job);
    };

    export async function UnmuteUser(id: number, chatId: number, reason: string | undefined = 'system'): Promise<void> {
        await bot.restrictChatMember(chatId, id, {
            can_send_messages: true,
        });

        logger.info(`Пользователь: ${id} был размучен по причине: ${reason}`);
    };

    export async function MuteUser(id: number, chatId: number, time: number, reason: string | undefined = 'причина не указана'): Promise<void> {
        await bot.restrictChatMember(chatId, id, {
            can_send_messages: false,
        });

        const parse = new Date();
        parse.setSeconds(time);

        await qdb.ModAsset.SavePunish(id.toString(), parse.toISOString(), reason, 'mute');
        logger.info(`Пользователь: ${id} был замучен по причине: ${reason}`);
    }

    export async function BanUser(id: number, chatId: number, until: number, reason: string | undefined = 'причина не указана'): Promise<void> {
        await bot.banChatMember(chatId, id, {
            until_date: until,
        });
        logger.info(`Пользователь: ${id} был забанен по причине: ${reason}`)
    }

    export async function WarnUser(id: number, chatId: number, time: Date, reason: string | undefined = 'причина не указана'): Promise<Model<any, any> & EventPunish> {
        const md = await models.ModModel.create({
            userId: id,
            expired: time,
            punish: 'warn',
            chatId: chatId,
        });

        return md as Model<any, any> & EventPunish;
    };

    export async function SaveCondition(id: number, where: 'warn' | 'mute', chatId: number): Promise<void | any> {
        const conditions = cond[where];

        const summary = await models.ModModel.findAll({
            where: {
                userId: id.toString(),
                punish: where,
                expired: { [Op.gt]: new Date() }
            }
        });

        switch (where) {
            case "warn":

                const summaryWarns = reduxWarns(summary?.length);

                for (const condition in conditions) {
                    if (Number(condition) as 3 | 7 !== summaryWarns) continue;

                    const c = (conditions as condition['warn'])[summaryWarns];
                    await MuteUser(id, chatId, c.time, `#${summaryWarns} предупреждение`);
                };
                break;

            case "mute":

                var until_date = Date.now();
                const summaryMutes = reduxMutes(summary?.length);

                for (const condition in conditions) {
                    if (Number(condition) as 3 | 5 | 7 | 10 !== summaryMutes) continue;

                    const c = ( conditions as condition['mute'])[summaryMutes];
                    await BanUser(id, chatId, until_date + c,`#${summaryMutes} мутов`);
                };
                break;
            
            default:
                return;
        };
    };
};

function reduxWarns(num: number): number {
    let res: number = num;
    while (num > 7) { num -= 7 };
    return res;
};

function reduxMutes(num: number): number {
    let res: number = num;
    while (num > 10) { res -= 10 };
    return res;
};

