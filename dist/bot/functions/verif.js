export function MessageOnRegexUrl(msg) {
    const regex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
    return [
        regex.test(msg),
        regex.exec(msg)
    ];
}
export function MessageOnUrl(msg) {
    const ul = msg.split(/ /);
    const res = [];
    for (var u of ul){
        try {
            res.push(new URL(u));
        } catch  {
            continue;
        }
    }
    ;
    return res;
}
export function MessageOnTeleGramUrl(msg) {
    const regex = /^(t.me?\/)?([\da-z\.-]+)?$/;
    return [
        regex.test(msg),
        regex.exec(msg)
    ];
}
