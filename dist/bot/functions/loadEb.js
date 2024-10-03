export const commands = new Map();
export function createCommand(cmd) {
    commands.set(cmd.name, {
        ex: cmd.execute.bind(cmd),
        mod: cmd.moderation || false
    });
}
