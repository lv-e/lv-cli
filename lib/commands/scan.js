"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.root_folders = exports.scan = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
const helpers_1 = require("../helpers/helpers");
const assert_1 = require("assert");
const helpText = `
'scan' will receive a input folder and search for the *.lvproject,
 scenes folders, shared folder and files and unused folders.
 the output will be a json describing the folder structure.`;
function scan(inputFolder, outputFile, mode = "run", project_file_extension = ".lvproject") {
    if (mode == "help")
        helpers_1.log(true, helpText);
    else {
        const vflag = mode == "verbose" ? true : false;
        helpers_1.log(vflag, "[command] " + "scan");
        helpers_1.log(vflag, "scanning " + inputFolder);
        let results = root_folders(inputFolder, project_file_extension);
        helpers_1.log(vflag, "writting scan results to " + outputFile);
        let jsonData = JSON.stringify(results, null, ' ');
        helpers_1.createDirs(outputFile);
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
function root_folders(root, project_file_extension) {
    let shared = [];
    let scenes = [];
    let unused = [];
    let project_file = null;
    fs_1.readdirSync(root, { withFileTypes: true })
        .filter(entry => entry.isFile())
        .forEach(entry => {
        if (entry.name.endsWith(project_file_extension)) {
            const extension = project_file_extension;
            const name = entry.name;
            const path = path_1.join(root, name);
            project_file = { path: path, name: name, extension: extension };
        }
    });
    if (project_file == null) {
        assert_1.fail("project file is missing!");
    }
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
    return { scenes, shared, unused, project_file,
        generated_at: (new Date()).toISOString()
    };
}
exports.root_folders = root_folders;
