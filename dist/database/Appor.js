/* eslint-disable @typescript-eslint/no-explicit-any */ import { models } from "./sequalize.js";
export const SetFastAsset = ()=>{
    const EconomyAsset = function() {
        async function getModal(id) {
            const [user] = await models.EconomyModel.findOrCreate({
                where: {
                    userId: id
                }
            });
            return user;
        }
        async function getJSON(id) {
            const user = await getModal(id);
            return user.toJSON();
        }
        ;
        async function increment({ userId }, opt) {
            const modal = await getModal(userId);
            const res = modal.increment(opt);
            return res;
        }
        ;
        return {
            getModal,
            getJSON,
            increment
        };
    }();
    const ModAsset = function() {
        async function getModals(id, punish) {
            const where = punish ? Object.assign({
                userId: id
            }, {
                punish: punish
            }) : {
                userId: id
            };
            const user = await models.ModModel.findAll({
                where: where
            });
            return user;
        }
        ;
        async function SavePunish(id, expired, reason, punish) {
            const pun = await models.ModModel.create({
                userId: id,
                expired: expired,
                punish: punish,
                reason: reason
            });
            return pun;
        }
        return {
            SavePunish,
            getModals
        };
    }();
    return {
        EconomyAsset,
        ModAsset
    };
};
global.qdb = SetFastAsset();
