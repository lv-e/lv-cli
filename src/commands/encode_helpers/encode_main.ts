import { encoded } from "../.."
import chalk = require("chalk")
import { join } from "path"
import { log, replaceAll } from "../../helpers/helpers"
import { writeFileSync } from "fs"
import { vflag, outputDir } from "../encode"
import { template_main_c } from "./templates"

export function encodeMain(encodedScenes:encoded[]) {
    
    log(vflag, chalk.blue("generating main.c file"))

    let includes = encodedScenes.map( s => s.include_directive ).join("\n")
    let mainCode = replaceAll(template_main_c, "{{scene_includes}}", includes)
    let mainFilePath = join(outputDir, "source", "main.c")
    
    writeFileSync(mainFilePath, mainCode)
    log(vflag, "done! main.c can be found at: " + mainFilePath)
}