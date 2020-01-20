import { readdir, readdirSync, Dirent, writeFileSync } from "fs";
import { extname } from "path";
import { log } from "../helpers/helpers";
import { Mode } from "..";

const helpText = `
'scan' will receive a input folder and search for
 scenes, shared files and unused ones.
 the output will be a json describing the folder structure.`

export interface FileMap {
    path:String
    name:String
    extension:String
}

export interface DirMap {
    files:FileMap[]
    path:String
    name:String
    directories:DirMap[]
}

export interface RootFolders {
    scenes: DirMap[];
    shared: DirMap[];
    unused: DirMap[];
    generated_at: String
}

export function scan(inputFolder:string, outputFile:string, mode:Mode = "run") {

    if (mode == "help") log(true, helpText)
    else {

        const vflag = mode == "verbose" ? true : false
        log(vflag, "[command] scan")

        log(vflag, "scanning " + inputFolder)
        let results = root_folders(inputFolder)

        log(vflag, "writting scan results to " + outputFile)
        let jsonData = JSON.stringify(results, null, ' ')
        writeFileSync(outputFile, jsonData)

        log(vflag, "project structure saved!")
    }
}

function list(folder:string, name:string) : DirMap {

    let files:FileMap[] = []
    let directories:DirMap[] = []

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

export function root_folders(root:string) : RootFolders {

    let shared: DirMap[] = []
    let scenes: DirMap[] = []
    let unused: DirMap[] = []

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

    return {
        scenes: scenes,
        shared: shared,
        unused: unused,
        generated_at: Date()
    }
}
