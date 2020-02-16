import { sceneMap, encoded, blankEncoded, dirMap, fileMap, encoder } from "../.."
import chalk = require("chalk")
import shell from "shelljs";
import astyle from "astyle";
import { join } from "path"
import { createDirs, replaceAll, removeBlankLines, log, saltForPath } from "../../helpers/helpers"
import { writeFileSync, readdirSync, readFileSync } from "fs"
import { vflag, outputDir, project } from "../encode"
import { template_scene_include, template_scene_cpp, template_scene_hpp } from "./templates";



export async function encodeScene(scene:sceneMap) : Promise<encoded> {

    log(vflag, chalk.blue("encoding: ") + chalk.cyan(scene.name))
    encodeSceneDir(scene, scene)

    const response = await mergeEncodedScene(scene)
    const sceneSourceDir = join(outputDir, "source")
        
    let hppPath = join(sceneSourceDir, scene.name + ".h")
    let cppPath = join(sceneSourceDir, scene.name + ".c") 
        
    createDirs(hppPath)
    createDirs(cppPath)

    writeFileSync(hppPath, response.hpp)
    writeFileSync(cppPath, response.cpp)

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
            log(vflag, "encoding file: " + file.name + " with " + encoder.npm_module)
            const path = join(outputDir, scene.name, "h-stripes")
            const salt = saltForPath(file.path)
            const outputFile = join(path, salt + file.name + ".h-stripe")
            shell.exec(encoder.cli_command + " -i " + file.path + " -o " + outputFile)
        }
    })
}

async function mergeEncodedScene(scene:sceneMap) {

    const sceneDir = join(outputDir, scene.name, "h-stripes")
    log(vflag, "reducing encoded scene files under dir " + sceneDir)
    const files = readdirSync(sceneDir)

    let reduced:encoded = blankEncoded()
    reduced.include_directive = applySceneReplaces(template_scene_include, scene)

    files.forEach( file => {

        const filepath = join(sceneDir, file)
        if (!filepath.endsWith(".h-stripe")) return

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

    let sceneCPPFile = await astyle.format(applyReplaces(template_scene_cpp))
    let sceneHPPFile = await astyle.format(applyReplaces(template_scene_hpp))

    return {hpp: sceneHPPFile, cpp: sceneCPPFile, encodedScene: reduced}
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
    if (index > -1) return index
    sceneTokens.push(scene.name)
    return sceneTokens.length - 1
}