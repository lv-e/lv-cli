import { randomBytes } from "crypto";
import { existsSync, mkdirSync } from "fs";
import path = require("path");

export function log(verbose:boolean, message:string) {
    if (verbose) console.log(message);
}

export function rand_salt(size:number) : string{
    return randomBytes(size/2).toString('hex').slice(0,size);
}

export function replaceAll(subject:string, search:string, replace:string) : string {
    return subject.split(search).join(replace);
}

export function removeBlankLines(subject:string) : string {
    return subject.replace(/^\s*\n/gm, "")
}

export function createDirs(filePath:string) {
    const dir = path.dirname(filePath);
    if (existsSync(dir)) return true;
    createDirs(dir);
    mkdirSync(dir);
}