import { fileMap, projectContent, encoder } from "../.."
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
            
            const outputPath = join(outputDir, "source")
            
            log(vflag, "encoding project: " + file.name)
            log(vflag, "using " + encoder.npm_module)
            createDirs(outputPath)
            
            const command = encoder.cli_command + " -i " + file.path + " -o " + outputPath
            log(vflag, command)
            shell.exec(command)
        }
    })

    return project
}

function updateModules(encoders:encoder[]){
    encoders.forEach ( encoder => {
        if (encoder.auto_update && !shell.which(encoder.cli_command)){
            log(vflag, "updating encoder under npm module named " + encoder.npm_module)
            shell.exec("npm install -g " + encoder.npm_module)   
        }
    })
}