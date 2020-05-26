"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.encodeProject = void 0;
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
    updateModules(encoders);
    encoders.forEach(encoder => {
        if (encoder.extension == file.extension) {
            const outputPath = path_1.join(encode_1.outputDir, "source");
            helpers_1.log(encode_1.vflag, "encoding project: " + file.name);
            helpers_1.log(encode_1.vflag, "using " + encoder.npm_module);
            helpers_1.createDirs(outputPath);
            const command = encoder.cli_command + " -i " + file.path + " -o " + outputPath;
            helpers_1.log(encode_1.vflag, command);
            shelljs_1.default.exec(command);
        }
    });
    return project;
}
exports.encodeProject = encodeProject;
function updateModules(encoders) {
    encoders.forEach(encoder => {
        if (encoder.auto_update && !shelljs_1.default.which(encoder.cli_command)) {
            helpers_1.log(encode_1.vflag, "updating encoder under npm module named " + encoder.npm_module);
            shelljs_1.default.exec("npm install -g " + encoder.npm_module);
        }
    });
}
