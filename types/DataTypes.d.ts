import { Model } from "sequelize";

export interface EconomyUserIncrementOptions {
    value?: (number | bigint) = 0,
}

export interface EconomyUserValueAttributes {
    userId: String;
    value?: number = 0;
}

export interface edb {
    getModal: (id: string) => Promise<Model<any, any>>;
    getJSON: (id: string) => Promise<EconomyUserValueAttributes>;
    increment: ({ userId }: { userId: string}, opt: EconomyUserIncrementOptions) => Promise<Model<any, any>>;
    
}

export type Punishes = 'mute' | 'ban' | 'warn';

export interface mdb {
    getModals: (id: string, options?: Punishes) => Promise<Model<any, any>[] | undefined>
    SavePunish: (id: string, expired: string, reason: string, punish: Punishes) => Promise<Model<any, any>>;
}

export interface FastAsset {
    EconomyAsset: edb,
    ModAsset: mdb,
}

export declare global {
    var qdb: FastAsset;
}