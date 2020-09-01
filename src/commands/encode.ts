import { readFileSync } from "fs";
import { log } from "../helpers/helpers";
import { mode, projectContent, rootFolders } from "../index";
import { encodeProject } from "./encode_helpers/encode_project";
import { encodeScene } from "./encode_helpers/encode_scene";
import { encodeShared } from "./encode_helpers/encode_shared";

const helpText = `
'encode' will receive a path to the project structure generated by 'scan'
 and encode files by its extension. the output will be a lot of .hstrip files
 and then, the source files ready to be compiled.`

 export let vflag:boolean = false
 export let outputDir:string
 export let project:projectContent

export async function encode(input:string, output:string, mode:mode) {
    if (mode == "help") log(true, helpText)
    else {

        outputDir = output
        vflag = mode == "verbose" ? true : false
        log(vflag, "[command] " + "encode")

        // load project file
        const projectJson = readFileSync(input, "utf8")
        const projectData:rootFolders = JSON.parse(projectJson) 
        
        // encode project, this will download the engine library too
        project = encodeProject(projectData)
        
        // encode all scenes, this will generate .hstripes
        let promises = projectData.scenes.map(async (scene) => encodeScene(scene))
        await Promise.all(promises)
        
        // encode all shared files & dirs
        await encodeShared(projectData.shared)
        
        log(vflag, "done encoding!")
    }
}