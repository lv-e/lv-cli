#!/usr/bin/env node
'use strict'

import meow from "meow"
import { scan } from "./commands/scan"
import { encode } from "./commands/encode"
import { reduce } from "./commands/reduce"
import { type } from "os"

let cli = meow(`
    Usage
    $ lv-cli [verbose|help] <action> -i <input> -o <output>
    where actions can be one of: scan, encode or reduce
    have fun! :)
`, {
    flags: {
        input: {
            type: 'string', alias: 'i', default: "."
        },
        output: {
            type: 'string', alias: 'o'
        }
    }
})

export type mode = ("run" | "help" | "verbose");

export type driver = {
    name: string;
    docker_image: string;
    cli_command: string;
    current?:boolean;
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

export type engineDefinition = {
    repo:string,
    tag:string
}

export type projectContent = {
    header:{
        version:string,
        engine:engineDefinition,
        drivers:driver[],
        encoders:encoder[]
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

switch (command) {
    case "help": console.log(cli.help); break
    case "scan": scan(input, output, mode); break;
    case "encode": encode(input, output, mode); break;
    case "reduce": reduce(input, output, mode); break;
    case "debug": console.log(cli.input[0], cli.flags); break
}
