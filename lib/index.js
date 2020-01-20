#!/usr/bin/env node
'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const meow_1 = __importDefault(require("meow"));
const scan_1 = require("./commands/scan");
const encode_1 = require("./commands/encode");
let cli = meow_1.default(`
    Usage
    $ lv-cli [verbose|help] <action> -i <input> -o <output>
`, {
    flags: {
        input: {
            type: 'string', alias: 'i', default: "."
        },
        output: {
            type: 'string', alias: 'o'
        }
    }
});
const input = cli.flags.input;
const output = cli.flags.output;
let command;
let mode;
switch (cli.input[0]) {
    case "verbose":
        command = cli.input[1];
        mode = "verbose";
        break;
    case "help":
        command = cli.input[1] != null ? cli.input[1] : "help";
        mode = "help";
        break;
    default:
        command = cli.input[0];
        mode = "run";
        break;
}
switch (command) {
    case "help":
        console.log(cli.help);
        break;
    case "scan":
        scan_1.scan(input, output, mode);
        break;
    case "encode":
        encode_1.encode(input, output, mode);
        break;
    case "debug":
        console.log(cli.input[0], cli.flags);
        break;
}
