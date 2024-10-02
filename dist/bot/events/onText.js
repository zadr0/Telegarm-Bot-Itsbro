import { bot } from "../bot.js";
import logger from "../logger.js";
import { commands } from "../functions/loadEb.js";
bot.on("message", async (ctx)=>{
    const res = ctx.text;
    if (!res || ctx?.from?.is_bot) return;
    const args = res.split(/ /g);
    switch(true){
        case ctx?.text?.startsWith(`/`):
            try {
                const commandString = args.shift()?.toLowerCase().slice(1);
                const command = commands.get(commandString || "");
                if (command) {
                    await command(ctx, args);
                } else {
                    await bot.sendMessage(ctx.chat.id, `Не нашлось команды!`);
                }
                ;
            } catch (x) {
                await bot.sendMessage(ctx.chat.id, `Произошла ошибка!`);
                logger.error(x);
            }
    }
});
