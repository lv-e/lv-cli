"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = require("crypto");
const fs_1 = require("fs");
const path = require("path");
function log(verbose, message) {
    if (verbose)
        console.log(message);
}
exports.log = log;
function saltForPath(path) {
    const digest = crypto_1.createHash('md5').update(path).digest("hex");
    return digest.slice(0, 6) + "-";
}
exports.saltForPath = saltForPath;
function rand_salt(size) {
    return crypto_1.randomBytes(size / 2).toString('hex').slice(0, size);
}
exports.rand_salt = rand_salt;
function replaceAll(subject, search, replace) {
    return subject.split(search).join(replace);
}
exports.replaceAll = replaceAll;
function removeBlankLines(subject) {
    return subject.replace(/^\s*\n/gm, "");
}
exports.removeBlankLines = removeBlankLines;
function createDirs(filePath) {
    const dir = path.dirname(filePath);
    if (fs_1.existsSync(dir))
        return true;
    createDirs(dir);
    fs_1.mkdirSync(dir);
}
exports.createDirs = createDirs;
