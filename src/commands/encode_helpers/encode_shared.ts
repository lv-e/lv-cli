import astyle from "astyle";
import { existsSync, readdirSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";
import shell from "shelljs";
import { blankEncoded, dirMap, encoded, fileMap } from "../..";
import { createDirs, log, removeBlankLines, replaceAll } from "../../helpers/helpers";
import { outputDir, project, vflag } from "../encode";
import { template_shared_hpp, template_shared_include } from "./templates";


export async function encodeShared(dirs:dirMap[]) {
    
    encodeSharedDirs(dirs)
    
    const response = await mergeEncodedSharedFolder()
    const sourceDir = join(outputDir, "lv-game")
    
    let hPath = join(sourceDir, "shared.h")
    createDirs(hPath)

    writeFileSync(hPath, response.header)
    return response.encodedScene
}

function encodeSharedDirs(dirs:dirMap[]) {
    dirs.map( dir => {
        encodeSharedDirs(dir.directories)
        dir.files.forEach( file => encodeSharedFile(file))
    })
}

function encodeSharedFile(file:fileMap){
    let encoders = project.header.encoders
    encoders.forEach( encoder => {
        if (encoder.extension == file.extension) {
            log(vflag, "encoding file: " + file.name + " with " + encoder.npm_module)
            const outputFile = join(outputDir, "artifacts", "shared", file.name + ".c-stripe")
            shell.exec(encoder.cli_command + " -i " + file.path + " -o " + outputFile)
        }
    })
}

async function mergeEncodedSharedFolder() {

    if (!existsSync("")){
        return {header: "// leave empty", encodedScene: blankEncoded()}
    }

    const sharedFilesDir = join(outputDir, "artifacts", "shared")
    log(vflag, "reducing encoded shared files at " + sharedFilesDir)
    const files = readdirSync(sharedFilesDir)

    let reduced:encoded = blankEncoded()
    reduced.include_directive = template_shared_include

    files.forEach( file => {
        if (!file.endsWith(".c-stripe")) return
        const filepath = join(sharedFilesDir, file)
        const jsonString = readFileSync(filepath, "utf8")
        const data:encoded = JSON.parse(jsonString)
        reduced.declarations += removeBlankLines("\n" + (data.declarations || ""))
    })

    function applyReplaces(subject:string) : string {
        return replaceAll(subject, "{{declarations}}", reduced.declarations || "")
    }

    let sharedHeaderFile = await astyle.format(applyReplaces(template_shared_hpp))

    return {header: sharedHeaderFile, encodedScene: reduced}
}