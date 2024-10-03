import { Command } from "../../../types/types";

export const commands = new Map<string, { ex: Command['execute'], mod?: boolean}>();

export function createCommand(cmd: Command): void {
    commands.set(cmd.name, { ex: cmd.execute.bind(cmd), mod: cmd.moderation || false});
};