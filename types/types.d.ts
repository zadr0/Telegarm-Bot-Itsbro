import { DataTypes } from "sequelize";

export declare global {
    namespace NodeJS {
        interface ProcessEnv {
            BOT_TOKEN: string;
            sql_DB: string;
            sql_host: string;
            sql_password: string;
            sql_user: string;
        }
    }
}

export interface EconomyUserIncrementOptions {
    value?: (number | bigint) = 0,
}

export interface EconomyUserValueAttributes {
    userId: String;
    value: (number | bigint) = 0;
}