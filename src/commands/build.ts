import shell from "shelljs";
import { log } from "../helpers/helpers";
import { mode } from "../index";

const helpText = `
'build' will invoke build.sh script. later it can be used to parameterize builds.
`

export let vflag:boolean = false
export let outputDir:string


export function build(input:string, output:string, mode:mode = "run") {
    if (mode == "help") log(true, helpText)
    else {
        
        vflag = mode == "verbose" ? true : false
        log(vflag, "[command] " + "build")

        const command = input
        log(vflag, "will run: " + command)
        shell.exec(command)
    }
}