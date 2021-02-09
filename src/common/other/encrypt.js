//采用sha256进行加密
export function encrypt(str) {
    let sha256 = require("js-sha256");
    var hash = sha256.create();
    hash.update(str);
    return hash.hex();
}