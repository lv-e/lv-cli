import { fileMap, projectContent, encoder } from "../.."
import chalk = require("chalk")
import shell from "shelljs";
import { join } from "path"
import { log, createDirs } from "../../helpers/helpers"
import { readFileSync } from "fs"
import { vflag, outputDir } from "../encode";

export function encodeProject(file:fileMap) : projectContent{

    const jsonString = readFileSync(file.path, "utf8")
    const project:projectContent = JSON.parse(jsonString) 
    
    let encoders = project.header.encoders

    log(vflag, "updating node modules...")
    updateModules(encoders)

    encoders.forEach( encoder => {
        if (encoder.extension == file.extension) {
            const outputPath = join(outputDir, "source", "lv", "engine.h")
            log(vflag, chalk.blue("encoding project: ") + chalk.cyan(file.name))
            log(vflag, "using " + encoder.npm_module)
            createDirs(outputPath)
            log(vflag, encoder.cli_command + " -i " + file.path + " -o " + outputPath)
            shell.exec(encoder.cli_command + " -i " + file.path + " -o " + outputPath)
        }
    })


    return project
}

function updateModules(encoders:encoder[]){
    
    // need to fix updateModules someday!
    // was having issues with sudo on mac

    //let encoders = project.header.encoders
    //let encoders:encoder[] = [] 

    encoders.forEach ( encoder => {
        if (!shell.which(encoder.cli_command)){
            log(vflag, "updating encoder under npm module named " + encoder.npm_module)
            shell.exec("npm install -g " + encoder.npm_module)   
        }
    })
}