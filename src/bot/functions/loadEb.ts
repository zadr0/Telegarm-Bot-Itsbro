import { Command } from "../../../types/types";

export const commands = new Map<string, Command['execute']>();

export function createCommand(cmd: Command): void {
    commands.set(cmd.name, cmd.execute.bind(cmd));
};