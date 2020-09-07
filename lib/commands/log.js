"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.log = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
const helpText = `
'log' will receive a input string and save it to output destination.`;
function log(inputString, outputFile, mode = "run") {
    const dir = path_1.dirname(outputFile);
    if (!fs_1.existsSync(dir))
        fs_1.mkdirSync(dir);
    fs_1.appendFileSync(outputFile, inputString + "\n", { encoding: "utf-8" });
    if (mode == "verbose")
        console.log("[log] " + inputString);
}
exports.log = log;
