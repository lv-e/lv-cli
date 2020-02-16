import { fileMap, projectContent, encoder } from "../.."
import chalk = require("chalk")
import shell from "shelljs";
import { join } from "path"
import { log } from "../../helpers/helpers"
import { readFileSync } from "fs"
import { vflag, outputDir } from "../encode";

export function encodeProject(file:fileMap) : projectContent{

    const jsonString = readFileSync(file.path, "utf8")
    const project:projectContent = JSON.parse(jsonString) 
    
    let encoders = project.header.encoders

    log(vflag, "updating node modules...")
    updateModules()

    encoders.forEach( encoder => {
        if (encoder.extension == file.extension) {
            const outputFile = join(outputDir, "h-stripes", file.name + ".h-stripe")
            log(vflag, chalk.blue("encoding project: ") + chalk.cyan(file.name))
            log(vflag, "using " + encoder.npm_module)
            shell.exec(encoder.cli_command + " -i " + file.path + " -o " + outputFile)
        }
    })

    return project
}

function updateModules(){
    log(vflag, "need to fix updateModules someday")
    // encoders.forEach ( encoder => {
    //     if (!shell.which(encoder.cli_command)){
    //         log(vflag, "updating encoder under npm module named " + encoder.npm_module)
    //         shell.exec("npm update -g " + encoder.npm_module)   
    //     }
    // })
}