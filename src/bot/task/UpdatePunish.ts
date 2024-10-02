import schedule from "node-schedule";
import type { EventPunish } from "../../../types/DataTypes";
import type { Model } from "sequelize"
import { models } from "../../database/sequalize.js";
import { bot } from "../bot.js";
import logger from "../logger";

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
        const job = schedule.scheduleJob(Punish.expired, () => unmute(Number(Punish.userId)));
        jobs.set(Punish.userId, job);
    };

    export async function unmute(id: number, reason: string = 'system'): Promise<void> {
        await bot.restrictChatMember(process.env.main_chatId, id, {
            can_send_messages: true,
        });

        logger.info(`Пользователь: ${id} был размучен по причине: ${reason}`);
    };

    export async function mute(id: number, chatId: number, time: number, reason: string): Promise<void> {
        await bot.restrictChatMember(chatId, id, {
            can_send_messages: false,
        });
    
        const parse = new Date();
        parse.setSeconds(parse.getSeconds() + time);
    
        await qdb.ModAsset.SavePunish(id.toString(), parse.toISOString(), reason, 'mute');
        logger.info(`Пользователь: ${id} был замучен по причине: ${reason}`);
    }

}