import crypto from "crypto";
const b56str = "23456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz";

export const generateBase56 = (len) => {
    const arr = new Uint8Array(len);
    crypto.getRandomValues(arr);
    let s = "";
    for (const x of arr) {
        s += b56str[~~(x/4.63)];
    }
    return s;
};

export const getCurrentTimestamp = () => {
    return Date.now();
};
