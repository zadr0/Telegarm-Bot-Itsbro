import { DataTypes } from "sequelize";
import TelegramBot, { } from "node-telegram-bot-api"

export declare global {
    namespace NodeJS {
        interface ProcessEnv {
            BOT_TOKEN: string;
            sql_DB: string;
            sql_host: string;
            sql_password: string;
            sql_user: string;
            main_chatId: string;
        }
    }
}

export interface Command {
    name: string,
    description: string = '_';
    moderation?: boolean = false;
    execute: (msg: TelegramBot.Message, args: string[] | undefined) => any | unknown;
}
