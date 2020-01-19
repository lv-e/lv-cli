#!/usr/bin/env node
'use strict'

import meow from "meow";
import { scan } from "./scan";

let cli = meow(`
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
})

switch (cli.input[0]) {
    case "help":
        console.log(cli.help)
        break

    case "scan":
        
        const dir = cli.flags.input
        console.log("scaning " + dir)
        
        let scanData = scan(dir)
        let jsonResponse = JSON.stringify(scanData, null, '  ')
        console.log(jsonResponse)

        break

    case "debug":
        console.log(cli.input[0], cli.flags)
        break
}