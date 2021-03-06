#!/usr/bin/env node
'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.syslog = exports.blankEncoded = void 0;
const meow_1 = __importDefault(require("meow"));
const build_1 = require("./commands/build");
const encode_1 = require("./commands/encode");
const log_1 = require("./commands/log");
const scan_1 = require("./commands/scan");
let cli = meow_1.default(`
    Usage
    $ lv-cli [verbose|help] <action> -i <input> -o <output>
    where actions can be one of: scan, encode, build, run
    have fun! :)
`, {
    flags: {
        input: {
            type: 'string', alias: 'i', default: "."
        },
        output: {
            type: 'string', alias: 'o'
        },
        logpath: {
            type: 'string', alias: 'l', default: "/lv/shared/log.txt"
        }
    }
});
function blankEncoded() {
    return { declarations: "", include_directive: "",
        on_awake: "", on_enter: "", on_exit: "", on_frame: "" };
}
exports.blankEncoded = blankEncoded;
const input = cli.flags.input;
const output = cli.flags.output;
const logpath = cli.flags.logpath;
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
function syslog(data) {
    log_1.log(data, logpath, mode);
}
exports.syslog = syslog;
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
    case "build":
        build_1.build(input, output, mode);
        break;
    case "log":
        log_1.log(input, logpath, mode);
        break;
    case "debug":
        console.log(cli.input[0], cli.flags);
        break;
}
