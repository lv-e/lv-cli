"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = require("path");
const helpers_1 = require("../helpers/helpers");
const helpText = `
'scan' will receive a input folder and search for
 scenes, shared files and unused ones.
 the output will be a json describing the folder structure.`;
function scan(inputFolder, outputFile, mode = "run") {
    if (mode == "help")
        helpers_1.log(true, helpText);
    else {
        const vflag = mode == "verbose" ? true : false;
        helpers_1.log(vflag, "[command] scan");
        helpers_1.log(vflag, "scanning " + inputFolder);
        let results = root_folders(inputFolder);
        helpers_1.log(vflag, "writting scan results to " + outputFile);
        let jsonData = JSON.stringify(results, null, ' ');
        fs_1.writeFileSync(outputFile, jsonData);
        helpers_1.log(vflag, "project structure saved!");
    }
}
exports.scan = scan;
function list(folder, name) {
    let files = [];
    let directories = [];
    fs_1.readdirSync(folder, { withFileTypes: true })
        .forEach(entry => {
        if (entry.isFile()) {
            const extension = path_1.extname(entry.name);
            const name = entry.name;
            const path = folder + "/" + name;
            files.push({ path: path, name: name, extension: extension });
        }
        else if (entry.isDirectory()) {
            directories.push(list(folder + "/" + entry.name, entry.name));
        }
    });
    return { files: files, path: folder, name: name, directories: directories };
}
function root_folders(root) {
    let shared = [];
    let scenes = [];
    let unused = [];
    fs_1.readdirSync(root, { withFileTypes: true })
        .filter(entry => entry.isDirectory())
        .forEach(entry => {
        const dir = entry.name;
        let data = list(root + "/" + dir, dir);
        if (dir.startsWith("scene_")) {
            scenes.push(data);
        }
        else if (dir.startsWith("shared_") || dir == "shared") {
            shared.push(data);
        }
        else {
            unused.push(data);
        }
    });
    return {
        scenes: scenes,
        shared: shared,
        unused: unused,
        generated_at: Date()
    };
}
exports.root_folders = root_folders;
