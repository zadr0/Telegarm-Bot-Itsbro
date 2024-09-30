import { models } from "./sequalize.js";
import type { EconomyUserValueAttributes, EconomyUserIncrementOptions, edb, mdb, FastAsset, Punishes } from "../../types/DataTypes";
import { Model } from "sequelize";

export const SetFastAsset = (): FastAsset => {
    const EconomyAsset = (function (): edb {
        async function getModal(id: string): Promise<Model<any, any>> {
            const [user] = await models.EconomyModel.findOrCreate({ where: { userId: id, }, });
            return user;
        }
        async function getJSON(id: string): Promise<EconomyUserValueAttributes> {
            const user = await getModal(id);
            return user.toJSON<EconomyUserValueAttributes>();
        };

        async function increment({ userId }: { userId: string }, opt: EconomyUserIncrementOptions): Promise<Model<any, any>> {
            const modal = await getModal(userId);
            const res = modal.increment(opt);
            return res;
        };

        return {
            getModal,
            getJSON,
            increment,
        };

    })();


    const ModAsset = (function(): mdb { 
        async function getModals(id: string, punish?: Punishes): Promise<Model<any, any>[] | undefined> {
            const where = punish ? Object.assign({ userId: id }, { punish: punish}) : { userId: id};
            const user = await models.ModModel.findAll({
                where: where
            });

            return user;
        };
        async function SavePunish(id: string, punish: Punishes): Promise<Model<any, any>> {
            const pun = await models.ModModel.create({
                userId: id,
                punish: punish,
            });

            return pun;
        }

        return {
            SavePunish,
            getModals,
        };
        
    })();

    return {
        EconomyAsset,
        ModAsset,
    }

};
global.qdb = SetFastAsset();