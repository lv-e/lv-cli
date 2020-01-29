import { readdir, readdirSync, Dirent, writeFileSync } from "fs";
import { extname, join } from "path";
import { log } from "../helpers/helpers";
import { mode, fileMap, dirMap, rootFolders, sceneMap } from "../index";
import { fail } from "assert";
import chalk = require("chalk");

const helpText = `
'scan' will receive a input folder and search for
 scenes, shared files and unused ones.
 the output will be a json describing the folder structure.`

export function scan(inputFolder:string, outputFile:string,
    mode:mode = "run", project_file_extension:string = ".lvproject") {

    if (mode == "help") log(true, helpText)
    else {

        const vflag = mode == "verbose" ? true : false
        log(vflag, chalk.green("[command] ") + chalk.blue("scan"))

        log(vflag, "scanning " + inputFolder)
        let results = root_folders(inputFolder, project_file_extension)

        log(vflag, "writting scan results to " + outputFile)
        let jsonData = JSON.stringify(results, null, ' ')
        writeFileSync(outputFile, jsonData)

        log(vflag, "project structure saved!")
    }
}

function list(folder:string, name:string) : dirMap {

    let files:fileMap[] = []
    let directories:dirMap[] = []

    readdirSync(folder, { withFileTypes: true })
        .forEach( entry => {
            if (entry.isFile()) {
                const extension = extname(entry.name)
                const name = entry.name
                const path = folder + "/" + name
                files.push({path:path, name:name, extension:extension})
            } else if (entry.isDirectory()) {
                directories.push(
                    list(folder + "/" + entry.name, entry.name)
                )
            }
        })

    return {files: files, path: folder, name: name, directories:directories}
}

export function root_folders(root:string, project_file_extension:string) : rootFolders {

    let shared: dirMap[] = []
    let scenes: sceneMap[] = []
    let unused: dirMap[] = []
    let project_file: fileMap | null = null
    
    readdirSync(root, { withFileTypes: true })
        .filter(entry => entry.isFile())
        .forEach(entry => {
            if(entry.name.endsWith(project_file_extension)){
                const extension = project_file_extension
                const name = entry.name
                const path = join(root, name)
                project_file = {path: path, name:name, extension:extension}
            }
        })

    if (project_file == null) {
        fail("project file is missing!")
    }

    readdirSync(root, { withFileTypes: true })
        .filter(entry => entry.isDirectory())
        .forEach( entry => {
            const dir = entry.name
            let data = list(root + "/" + dir, dir) 
            if (dir.startsWith("scene_")) {
                scenes.push(data)
            } else if (dir.startsWith("shared_") || dir == "shared") {
                shared.push(data)
            } else {
                unused.push(data)
            }
        })

    return { scenes, shared, unused, project_file,
        generated_at: (new Date()).toISOString()
    }
}
