import { log } from "../helpers/helpers"
import { mode } from "../index";
import shell from "shelljs";
import chalk from "chalk";

const helpText = `
'build' will invoke build.sh script. later it can be used to parameterize builds.
`

export let vflag:boolean = false
export let outputDir:string


export function build(input:string, output:string, mode:mode = "run") {
    if (mode == "help") log(true, helpText)
    else {
        
        vflag = mode == "verbose" ? true : false
        log(vflag, chalk.green("[command] ") + chalk.blue("build"))

        const command = "make -f " + input + " -o " + output
        log(vflag, command)
        shell.exec(command)

    }
}