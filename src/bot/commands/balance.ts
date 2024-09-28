import { bot } from "../bot.js";
import { EconomyModel } from "../../database/Models.js";
import type { EconomyUserValueAttributes} from "../../../types/types";

bot.command('balance', async (ctx) => {


    ctx.sendGame('', {
        
    })

    await ctx.reply(`hi: , value: `);
});