
import { appendFileSync, existsSync, mkdirSync } from "fs";
import { dirname } from "path";
import { mode } from "../index";

const helpText = `
'log' will receive a input string and save it to output destination.`

export function log(inputString:string, outputFile:string = "/lv/shared/log.txt", mode:mode = "run") {
    const dir = dirname(outputFile)
    if(!existsSync(dir)) mkdirSync(dir)
    appendFileSync(outputFile, inputString + "\n", {encoding: "utf-8"})
}