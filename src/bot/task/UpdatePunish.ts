import schedule from "node-schedule";
import type { condition, EventPunish, } from "../../../types/DataTypes";
import { Op, type Model } from "sequelize"
import { models } from "../../database/sequalize.js";
import { bot } from "../bot.js";
import logger from "../logger.js";
import { condition as cond } from './condition.js';

export namespace PunishManager {
    export const jobs = new Map<string, schedule.Job>();

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
        try {
            await bot.restrictChatMember(chatId, id, {
                can_send_messages: true,
            });

            const res = await models.ModModel.findOne({
                where: {
                    userId: id,
                    punish: 'mute',
                    expired: { [Op.gt]: Date.now()},
                }
            })

            if (res) { await res.destroy( ) };

            jobs.delete(id.toString());
            logger.info(`Пользователь: ${id} был размучен по причине: ${reason}`);

        } catch (x: any) {

            switch (x?.response?.statusCode) {
                case 400:
                    jobs.delete(id.toString());
                    break;
                default:
                    logger.error(x);
                    break

            }
        };
    };

    export async function GetPunishes(id: number): Promise<(Model<any, any> & EventPunish)[] | undefined> {
        try {
            const mds = await models.ModModel.findAll({
                where: {
                    userId: id,
                },
            }) as (Model<any, any> & EventPunish)[];

            return mds;

        } catch(x: any) {
            logger.error(x);
        }
    }
    
    export async function ClearWarn(id: number): Promise<number | undefined> {
        try {
            const res = await models.ModModel.destroy({ where: {
                EventId: id,
            }});

            return res;
        } catch(x) {
            logger.error(x);
        }
    }

    export async function MuteUser(id: number, chatId: number, time: number, reason: string | undefined = 'причина не указана'): Promise<(Model<any, any> & EventPunish) | undefined> {
        try {
            await bot.restrictChatMember(chatId, id, {
                can_send_messages: false,
            });

            const parse = new Date();
            parse.setSeconds(time);

            const md = await models.ModModel.create({
                userId: id,
                expired: time,
                punish: 'mute',
                chatId: chatId,
                reason: reason,
            }) as Model<any, any> & EventPunish;

            const res = await SaveCondition(id, 'mute', chatId);

            if (!res) {
                if (jobs.has(id.toString())) return;
                const job = schedule.scheduleJob(md.expired, () => UnmuteUser(id, chatId));
                jobs.set(id.toString(), job);
            };

            logger.info(`Пользователь: ${id} был замучен по причине: ${reason}`);

            return md;


        } catch (x: any) {

            switch (x?.response?.statusCode) {
                case 400:
                    logger.warn(`Чат не являеться супергруппой!`)
                    break;
                default:
                    logger.error(x);
                    break
            };
        }
    }

    export async function BanUser(id: number, chatId: number, until: number, reason: string | undefined = 'причина не указана'): Promise<void> {
        try {
            await bot.banChatMember(chatId, id, {
                until_date: until,
            });
            logger.info(`Пользователь: ${id} был забанен по причине: ${reason}`);
        } catch (x: any) {

            switch (x?.response?.statusCode) {
                case 400:
                    logger.warn(`Чат не являеться группой!`)
                    break;
                default:
                    logger.error(x);
                    break
            };
        };
    };

    export async function WarnUser(id: number, chatId: number, time: Date, reason: string | undefined = 'причина не указана'): Promise<(Model<any, any> & EventPunish)> {

        logger.info(`Пользователь: ${id} получил предупреждение по причине: ${reason}`);

        const md = await models.ModModel.create({
            userId: id,
            expired: time,
            punish: 'warn',
            chatId: chatId,
            reason: reason
        }) as Model<any, any> & EventPunish;

        const res = await SaveCondition(id, 'warn', chatId);

        return md as Model<any, any> & EventPunish;
    };

    export async function SaveCondition(id: number, where: 'warn' | 'mute', chatId: number): Promise<boolean> {
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

                const summaryWarns = await reduxWarns(summary?.length)

                for (const condition in conditions) {
                    if (Number(condition) as 3 | 7 !== summaryWarns) continue;

                    const c = (conditions as condition['warn'])[summaryWarns];
                    await MuteUser(id, chatId, c.time, `#${summaryWarns} предупреждение`);
                    c.reset && await ResetWarns(id);
                    return true;
                };
                return false;

            case "mute":

                var until_date = Date.now();
                const summaryMutes = await reduxMutes(summary?.length);

                for (const condition in conditions) {
                    if (Number(condition) as 3 | 5 | 7 | 10 !== summaryMutes) continue;

                    const c = (conditions as condition['mute'])[summaryMutes];
                    await BanUser(id, chatId, until_date + c, `#${summaryMutes} мутов`);
                    return true;
                };

                return false;

            default:
                return false;
        };
    };

    export async function ResetWarns(id: number) {


    }
};

async function reduxWarns(num: number): Promise<number> {
    let res: number = num;
    while (res > 7) { res -= 7 };
    return res;
};

async function reduxMutes(num: number): Promise<number> {
    let res: number = num;
    while (res > 10) { res -= 10 };
    return res;
};

