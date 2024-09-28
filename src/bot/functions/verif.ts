

export function MessageOnRegexUrl(msg: string): [boolean, Array<string> | null] {
    const regex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/
    return [regex.test(msg), regex.exec(msg)];
}

export function MessageOnUrl(msg: string): (URL | null)[] {

    const ul = (msg.split(/ /));

    const res: (URL | null)[] = [];
    for (var u of ul) {
        try { res.push(new URL(u)); } catch { continue; }
    };

    return res;
}

export function MessageOnTeleGramUrl(msg: string): [boolean, Array<string> | null] {
    const regex = /^(t.me?\/)?([\da-z\.-]+)?$/
    return [regex.test(msg), regex.exec(msg)];
}