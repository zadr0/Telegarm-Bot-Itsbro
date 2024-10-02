import Teleg from "node-telegram-bot-api";
import "dotenv/config";
import loader from "./loader.js";
import "../database/Appor.js";
import schedule from "node-schedule";

export const bot = new Teleg(process.env.BOT_TOKEN, {
    polling: true
});

await loader();

process.on('SIGINT', () => {
    schedule.gracefulShutdown().then(() => { process.exit(0) });
});