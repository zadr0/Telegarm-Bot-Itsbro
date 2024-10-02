import { Punishes } from "../../../types/DataTypes";
import { models } from "../../database/sequalize.js";
import { bot } from "../bot.js";
import { PunishManager } from "../task/UpdatePunish.js";

export async function SaveCondition(id: number, where: Punishes, chatId: number): Promise<void | any> {
    const condition = await qdb.ModAsset.getModals(id.toString(), where);

    if (!condition) return null;

    switch (where) {
        case "warn":

            switch (condition.length) {
                case 3:
                    await PunishManager.mute(id, chatId, 90 * 60 * 1000, '#3 Предупреждения');

                    break;

                case 7:

                    await PunishManager.mute(id, chatId, 3 * 60 * 60 * 1000, '#7 Предупреждения');

                    await models.ModModel.destroy({
                        where: {
                            userId: id,
                            punish: where,
                        },
                    });

                    break;
            }
            break;
    }
}