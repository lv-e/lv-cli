"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chalk = require("chalk");
const path_1 = require("path");
const helpers_1 = require("../../helpers/helpers");
const fs_1 = require("fs");
const encode_1 = require("../encode");
const templates_1 = require("./templates");
function encodeMain(encodedScenes) {
    helpers_1.log(encode_1.vflag, chalk.blue("generating main.cpp file"));
    let includes = encodedScenes.map(s => s.include_directive).join("\n");
    let mainCode = helpers_1.replaceAll(templates_1.template_main_c, "{{scene_includes}}", includes);
    let mainFilePath = path_1.join(encode_1.outputDir, "source", "main.cpp");
    fs_1.writeFileSync(mainFilePath, mainCode);
    helpers_1.log(encode_1.vflag, "done! main.c can be found at: " + mainFilePath);
}
exports.encodeMain = encodeMain;
