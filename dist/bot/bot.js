import { Telegraf } from "telegraf";
import "dotenv/config";
import loader from "./loader.js";
export const bot = new Telegraf(process.env.BOT_TOKEN);
await loader();
bot.launch();
process.once('SIGINT', ()=>bot.stop('SIGINT'));
process.once('SIGTERM', ()=>bot.stop('SIGTERM'));
