import fs from "fs";
import path from "path";
import logger from "./logger.js";

export default (async function loadReq(): Promise<void> {
    let res: string[];



    for await (let i of ["/commands/", "/events/"]) {
        res = fs.readdirSync(path.join(process.cwd(), 'dist/bot', i));
        res.forEach(async (file) => {
            const pa = path.join(process.cwd(), 'dist/bot', i, file);
            await import(`.${i}/${file}`);
        });
        logger.info(`Dir ${i} Loaded!`);
    };
});