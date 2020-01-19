#!/usr/bin/env node
'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const meow_1 = __importDefault(require("meow"));
const scan_1 = require("./scan");
let cli = meow_1.default(`
    Usage
    $ lv-cli <action> -i <input> -o <output>
`, {
    flags: {
        input: {
            type: 'string',
            alias: 'i',
            default: "."
        },
        output: {
            type: 'string',
            alias: 'o'
        }
    }
});
switch (cli.input[0]) {
    case "help":
        console.log(cli.help);
        break;
    case "scan":
        const dir = cli.flags.input;
        console.log("scaning " + dir);
        let scanData = scan_1.scan(dir);
        let jsonResponse = JSON.stringify(scanData, null, '  ');
        console.log(jsonResponse);
        break;
    case "debug":
        console.log(cli.input[0], cli.flags);
        break;
}
