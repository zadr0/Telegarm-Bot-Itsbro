export const commands = new Map();
export function createCommand(cmd) {
    commands.set(cmd.name, cmd.execute.bind(cmd));
}
