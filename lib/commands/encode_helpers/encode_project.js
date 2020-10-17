"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.encodeProject = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
const shelljs_1 = __importDefault(require("shelljs"));
const __1 = require("../..");
const helpers_1 = require("../../helpers/helpers");
const encode_1 = require("../encode");
const templates_1 = require("./templates");
function encodeProject(root) {
    const file = root.project_file;
    const jsonString = fs_1.readFileSync(file.path, "utf8");
    const project = JSON.parse(jsonString);
    let encoders = project.header.encoders;
    let drivers = project.header.drivers;
    updateModules(encoders);
    encoders.forEach(encoder => {
        if (encoder.extension == file.extension) {
            __1.syslog(`encoding project with ${encoder.cli_command}`);
            const outputPath = path_1.join(encode_1.outputDir, "lv-game");
            helpers_1.createDirs(outputPath);
            const command = encoder.cli_command + " -i " + file.path + " -o " + outputPath;
            helpers_1.log(encode_1.vflag, command);
            shelljs_1.default.exec(command);
        }
    });
    drivers.forEach(driver => {
        if (driver.current != true)
            return;
        writeDriverKs(driver, root);
    });
    return project;
}
exports.encodeProject = encodeProject;
function writeDriverKs(driver, root) {
    if (driver.properties == null)
        return;
    const display_width = driver.properties["display_width"];
    const display_heigth = driver.properties["display_heigth"];
    const debug_mode = driver.properties["debug_mode"];
    const scene_count = root.scenes.length;
    let template = templates_1.template_lvk_h;
    template = helpers_1.replaceAll(template, "{{lvk_scene_count}}", `${scene_count}`);
    template = helpers_1.replaceAll(template, "{{lvk_display_w}}", display_width);
    template = helpers_1.replaceAll(template, "{{lvk_display_h}}", display_heigth);
    template = helpers_1.replaceAll(template, "{{lvk_debug_mode}}", Boolean(debug_mode) ? "1" : "0");
    __1.syslog(`writing driver's constants (lvk.h)`);
    const writePath = path_1.join(encode_1.outputDir, "lv-game", "lvk.h");
    helpers_1.createDirs(writePath);
    fs_1.writeFileSync(writePath, template);
}
function updateModules(encoders) {
    encoders.forEach(encoder => {
        if (encoder.auto_update || !shelljs_1.default.which(encoder.cli_command)) {
            __1.syslog(`updating ${encoder.extension} encoder`);
            shelljs_1.default.exec("npm install -g " + encoder.npm_module);
        }
    });
}
