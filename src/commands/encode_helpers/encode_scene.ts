import astyle from "astyle";
import { readdirSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";
import shell from "shelljs";
import { blankEncoded, dirMap, encoded, fileMap, sceneMap, syslog } from "../..";
import { createDirs, removeBlankLines, replaceAll, saltForPath } from "../../helpers/helpers";
import { outputDir, project } from "../encode";
import { template_scene_c, template_scene_h, template_scene_include } from "./templates";


export async function encodeScene(scene:sceneMap) : Promise<encoded> {

    syslog("generating " + scene.name)    
    encodeSceneDir(scene, scene)

    const response = await mergeEncodedScene(scene)
    const sceneSourceDir = join(outputDir, "lv-game")
        
    let hppPath = join(sceneSourceDir, scene.name + ".h")
    let cppPath = join(sceneSourceDir, scene.name + ".cpp") 
        
    createDirs(hppPath)
    createDirs(cppPath)

    writeFileSync(hppPath, response.hpp)
    writeFileSync(cppPath, response.cpp)
    
    syslog(`${scene.name} encoded!`)

    return response.encodedScene
}

// --- encode dir, file and then merge

function encodeSceneDir(dir:dirMap, scene:sceneMap) {
    dir.directories.forEach( dir => encodeSceneDir(dir, scene))
    dir.files.forEach( file => encodeSceneFile(file, scene))
}

function encodeSceneFile(file:fileMap, scene:sceneMap) {
    let encoders = project.header.encoders
    encoders.forEach( encoder => {
        if (encoder.extension == file.extension) {
            
            syslog(`encoding ${file.name} with ${encoder.cli_command}`)

            const path = join(outputDir, "artifacts", scene.name)
            const salt = saltForPath(file.path)
            const outputFile = join(path, salt + file.name + ".c-stripe")
            shell.exec(encoder.cli_command + " -i " + file.path + " -o " + outputFile)
            
        }
    })
}

async function mergeEncodedScene(scene:sceneMap) {

    syslog(`merging ${scene.name} files`)
    
    const sceneDir = join(outputDir, "artifacts", scene.name)
    const files = readdirSync(sceneDir)

    let reduced:encoded = blankEncoded()
    reduced.include_directive = applySceneReplaces(template_scene_include, scene)

    files.forEach( file => {

        const filepath = join(sceneDir, file)
        if (!filepath.endsWith(".c-stripe")) return

        const jsonString = readFileSync(filepath, "utf8")
        const data:encoded = JSON.parse(jsonString)

        reduced.declarations   += removeBlankLines("\n" + (data.declarations || ""))
        reduced.on_awake       += removeBlankLines("\n" + (data.on_awake || ""))
        reduced.on_enter       += removeBlankLines("\n" + (data.on_enter || ""))
        reduced.on_frame       += removeBlankLines("\n" + (data.on_frame || ""))
        reduced.on_exit        += removeBlankLines("\n" + (data.on_exit  || ""))
    })

    function applyReplaces(subject:string) : string {
        let mutable = applySceneReplaces(subject, scene)
        mutable = replaceAll(mutable, "{{declarations}}", reduced.declarations || "")
        mutable = replaceAll(mutable, "{{on_awake}}", reduced.on_awake || "")
        mutable = replaceAll(mutable, "{{on_enter}}", reduced.on_enter || "")
        mutable = replaceAll(mutable, "{{on_frame}}", reduced.on_frame || "")
        mutable = replaceAll(mutable, "{{on_exit}}" , reduced.on_exit  || "")
        return mutable
    }

    let sceneCFile = await astyle.format(applyReplaces(template_scene_c))
    let sceneHFile = await astyle.format(applyReplaces(template_scene_h))

    return {hpp: sceneHFile, cpp: sceneCFile, encodedScene: reduced}
}

// --- helpers

function applySceneReplaces(subject:string, scene:sceneMap) : string {
    let mutable = subject
    mutable = replaceAll(mutable, "{{scene_name}}", scene.name)
    mutable = replaceAll(mutable, "{{uppercased_scene_name}}", scene.name.toUpperCase())
    mutable = replaceAll(mutable, "{{scene_id}}", " " + identifierForScene(scene))
    return mutable
}

let sceneTokens:string[] = []

function identifierForScene(scene:sceneMap) : number {
    let index = sceneTokens.indexOf(scene.name)
    if (index > -1) return index + 1
    sceneTokens.push(scene.name)
    return sceneTokens.length
}