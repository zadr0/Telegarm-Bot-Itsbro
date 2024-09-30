
export function MessageOnUrl(msg: string): (URL | null)[] {
    const ul = (msg.split(/ /));
    const res: (URL | null)[] = [];
    for (var u of ul) {
        try { res.push(new URL(u)); } catch { continue; }
    };
    return res;
};
