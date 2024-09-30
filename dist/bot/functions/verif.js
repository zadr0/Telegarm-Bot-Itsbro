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
