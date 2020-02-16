#!/usr/bin/env node
'use strict'

import meow from "meow"
import { scan } from "./commands/scan"
import { encode } from "./commands/encode"

let cli = meow(`
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
})

export type mode = ("run" | "help" | "verbose");

export type encoder = {
    extension: string;
    npm_module: string;
    cli_command: string;
};

export type encoded = {
    declarations:   string | null
    on_awake:       string | null
    on_enter:       string | null
    on_exit:        string | null
    on_frame:       string | null
    globals:        string | null
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
    case "debug": console.log(cli.input[0], cli.flags); break
}
