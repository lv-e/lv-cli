"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk = require("chalk");
const shelljs_1 = __importDefault(require("shelljs"));
const path_1 = require("path");
const helpers_1 = require("../../helpers/helpers");
const fs_1 = require("fs");
const encode_1 = require("../encode");
function encodeProject(file) {
    const jsonString = fs_1.readFileSync(file.path, "utf8");
    const project = JSON.parse(jsonString);
    let encoders = project.header.encoders;
    helpers_1.log(encode_1.vflag, "updating node modules...");
    updateModules();
    encoders.forEach(encoder => {
        if (encoder.extension == file.extension) {
            const outputFile = path_1.join(encode_1.outputDir, "h-stripes", file.name + ".h-stripe");
            helpers_1.log(encode_1.vflag, chalk.blue("encoding project: ") + chalk.cyan(file.name));
            helpers_1.log(encode_1.vflag, "using " + encoder.npm_module);
            shelljs_1.default.exec(encoder.cli_command + " -i " + file.path + " -o " + outputFile);
        }
    });
    return project;
}
exports.encodeProject = encodeProject;
function updateModules() {
    helpers_1.log(encode_1.vflag, "need to fix updateModules someday");
    // encoders.forEach ( encoder => {
    //     if (!shell.which(encoder.cli_command)){
    //         log(vflag, "updating encoder under npm module named " + encoder.npm_module)
    //         shell.exec("npm update -g " + encoder.npm_module)   
    //     }
    // })
}
