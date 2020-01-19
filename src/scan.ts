import { readdir, readdirSync, Dirent } from "fs";
import { extname } from "path";

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
}

export function scan(folder:string) : RootFolders{
    return root_folders(folder)
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
                directories.push(list(folder + "/" + entry.name, entry.name))
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
        unused: unused
    }
}
