#!/usr/bin/env node
'use strict'

import meow from "meow"
import { build } from "./commands/build"
import { encode } from "./commands/encode"
import { log } from "./commands/log"
import { scan } from "./commands/scan"

let cli = meow(`
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
        }
        ,
        logpath: {
            type: 'string', alias: 'l', default: "/lv/shared/log.txt"
        }
    }
})

export type mode = ("run" | "help" | "verbose");

export type driver = {
    name: string;
    docker_image: string;
    cli_command: string;
    current?:boolean;
    properties?: {[name: string]: string}
    secrets?: {[name: string]: string}
}

export type encoder = {
    extension: string;
    npm_module: string;
    auto_update: boolean;
    cli_command: string;
};

export type encoded = {
    declarations:(string | null)
    include_directive:(string | null)
    on_awake:(string | null)
    on_enter:(string | null)
    on_exit:(string | null)
    on_frame:(string | null)
}

export function blankEncoded():encoded {
    return { declarations: "", include_directive: "",
        on_awake: "", on_enter: "", on_exit: "", on_frame: "" }
}

export type fileMap = {
    path:string
    name:string
    extension:string
}

export type dirMap = {
    files:fileMap[]
    path:string
    name:string
    directories:dirMap[]
}

export type sceneMap = dirMap

export type projectContent = {
    header:{
        version:string,
        drivers:driver[],
        encoders:encoder[]
    },
    editor:{
        openedFiles:string[]
        selectedFile:(string|null)
    }
}

export type rootFolders = {
    scenes: sceneMap[]
    shared: dirMap[]
    unused: dirMap[]
    project_file: fileMap
    generated_at: string
}

const input = cli.flags.input
const output = cli.flags.output
const logpath = cli.flags.logpath

let command:string
let mode:mode

switch (cli.input[0]) {
    case "verbose":
        command = cli.input[1]
        mode = "verbose"
        break
    case "help":
        command = cli.input[1] != null ? cli.input[1] : "help"
        mode = "help"
        break
    default:
        command = cli.input[0]
        mode = "run"    
        break
}

export function syslog(data:string) {
    log(data, logpath, mode)
}

switch (command) {
    case "help": console.log(cli.help); break
    case "scan": scan(input, output, mode); break;
    case "encode": encode(input, output, mode); break;
    case "build": build(input, output, mode); break;
    case "log": log(input, logpath, mode); break;
    case "debug": console.log(cli.input[0], cli.flags); break
}
