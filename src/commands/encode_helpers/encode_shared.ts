import { fileMap, dirMap, encoded, blankEncoded } from "../..";
import { project, vflag, outputDir } from "../encode";
import { join } from "path";
import shell from "shelljs";
import astyle from "astyle";
import { log, removeBlankLines, replaceAll, createDirs } from "../../helpers/helpers";
import { readdirSync, readFileSync, writeFileSync } from "fs";
import { template_shared_include, template_shared_hpp } from "./templates";

export async function encodeSharedDir(dir:dirMap) {
    dir.directories.forEach( dir => encodeSharedDir(dir))
    dir.files.forEach( file => encodeSharedFile(file))

    const response = await mergeEncodedSharedFolder()
    const sourceDir = join(outputDir, "source")
    
    let hppPath = join(sourceDir, "shared.h")
    createDirs(hppPath)

    writeFileSync(hppPath, response.hpp)
    return response.encodedScene
}

function encodeSharedFile(file:fileMap){
    let encoders = project.header.encoders
    encoders.forEach( encoder => {
        if (encoder.extension == file.extension) {
            log(vflag, "encoding file: " + file.name + " with " + encoder.npm_module)
            const outputFile = join(outputDir, "shared", "h-stripes", file.name + ".h-stripe")
            shell.exec(encoder.cli_command + " -i " + file.path + " -o " + outputFile)
        }
    })
}

async function mergeEncodedSharedFolder() {

    const sharedFilesDir = join(outputDir, "shared", "h-stripes")
    log(vflag, "reducing encoded shared files at " + sharedFilesDir)
    const files = readdirSync(sharedFilesDir)

    let reduced:encoded = blankEncoded()
    reduced.include_directive = template_shared_include

    files.forEach( file => {
        const filepath = join(sharedFilesDir, file)
        const jsonString = readFileSync(filepath, "utf8")
        const data:encoded = JSON.parse(jsonString)
        reduced.declarations += removeBlankLines("\n" + (data.declarations || ""))
    })

    function applyReplaces(subject:string) : string {
        return replaceAll(subject, "{{declarations}}", reduced.declarations || "")
    }

    let sharedHPPFile = await astyle.format(applyReplaces(template_shared_hpp))

    return {hpp: sharedHPPFile, encodedScene: reduced}
}