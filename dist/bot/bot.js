import Teleg from "node-telegram-bot-api";
import "dotenv/config";
import loader from "./loader.js";
import "../database/Appor.js";
export const bot = new Teleg(process.env.BOT_TOKEN, {
    polling: true
});
await loader();
