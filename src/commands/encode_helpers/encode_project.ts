import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import shell from "shelljs";
import { driver, encoder, projectContent, rootFolders, syslog } from "../..";
import { createDirs, log, replaceAll } from "../../helpers/helpers";
import { outputDir, vflag } from "../encode";
import { template_lvk_h } from "./templates";


export function encodeProject(root:rootFolders) : projectContent{
    
    const file = root.project_file
    const jsonString = readFileSync(file.path, "utf8")
    const project:projectContent = JSON.parse(jsonString) 
    
    let encoders = project.header.encoders
    let drivers  = project.header.drivers

    updateModules(encoders)

    encoders.forEach( encoder => {
        if (encoder.extension == file.extension) {
            
            syslog(`encoding project with ${encoder.cli_command}`)

            const outputPath = join(outputDir, "lv-game")
            createDirs(outputPath)
            
            const command = encoder.cli_command + " -i " + file.path + " -o " + outputPath
            log(vflag, command)
            shell.exec(command)
        }
    })

    drivers.forEach( driver => {
        if (driver.current != true) return;
        writeDriverKs(driver, root)
    })
    
    return project
}


function writeDriverKs(driver:driver, root:rootFolders){
    
    if (driver.properties == null ) return;
    const display_width     = driver.properties["display_width"]
    const display_heigth    = driver.properties["display_heigth"]
    const scene_count       = root.scenes.length

    let template = template_lvk_h
    template = replaceAll(template, "{{lvk_scene_count}}", `${scene_count}`)
    template = replaceAll(template, "{{lvk_display_w}}", display_width)
    template = replaceAll(template, "{{lvk_display_h}}", display_heigth)
    
    syslog(`writing driver's constants (lvk.h)`)

    const writePath = join(outputDir, "lv-game", "lvk.h")
    createDirs(writePath)
    writeFileSync(writePath, template)
}

function updateModules(encoders:encoder[]){
    encoders.forEach ( encoder => {
        if (encoder.auto_update || !shell.which(encoder.cli_command)){
            syslog(`updating encoder ${encoder.npm_module}`)
            shell.exec("npm install -g " + encoder.npm_module)   
        }
    })
}