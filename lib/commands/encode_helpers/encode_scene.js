"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.encodeScene = void 0;
const astyle_1 = __importDefault(require("astyle"));
const fs_1 = require("fs");
const path_1 = require("path");
const shelljs_1 = __importDefault(require("shelljs"));
const __1 = require("../..");
const helpers_1 = require("../../helpers/helpers");
const encode_1 = require("../encode");
const templates_1 = require("./templates");
function encodeScene(scene) {
    return __awaiter(this, void 0, void 0, function* () {
        helpers_1.log(encode_1.vflag, "encoding: " + scene.name);
        encodeSceneDir(scene, scene);
        const response = yield mergeEncodedScene(scene);
        const sceneSourceDir = path_1.join(encode_1.outputDir, "lv-game");
        let hppPath = path_1.join(sceneSourceDir, scene.name + ".h");
        let cppPath = path_1.join(sceneSourceDir, scene.name + ".cpp");
        helpers_1.createDirs(hppPath);
        helpers_1.createDirs(cppPath);
        fs_1.writeFileSync(hppPath, response.hpp);
        fs_1.writeFileSync(cppPath, response.cpp);
        return response.encodedScene;
    });
}
exports.encodeScene = encodeScene;
// --- encode dir, file and then merge
function encodeSceneDir(dir, scene) {
    dir.directories.forEach(dir => encodeSceneDir(dir, scene));
    dir.files.forEach(file => encodeSceneFile(file, scene));
}
function encodeSceneFile(file, scene) {
    let encoders = encode_1.project.header.encoders;
    encoders.forEach(encoder => {
        if (encoder.extension == file.extension) {
            helpers_1.log(encode_1.vflag, "encoding file: " + file.name + " with " + encoder.npm_module);
            const path = path_1.join(encode_1.outputDir, "artifacts", scene.name);
            const salt = helpers_1.saltForPath(file.path);
            const outputFile = path_1.join(path, salt + file.name + ".c-stripe");
            shelljs_1.default.exec(encoder.cli_command + " -i " + file.path + " -o " + outputFile);
        }
    });
}
function mergeEncodedScene(scene) {
    return __awaiter(this, void 0, void 0, function* () {
        const sceneDir = path_1.join(encode_1.outputDir, "artifacts", scene.name);
        helpers_1.log(encode_1.vflag, "reducing encoded scene files under dir " + sceneDir);
        const files = fs_1.readdirSync(sceneDir);
        let reduced = __1.blankEncoded();
        reduced.include_directive = applySceneReplaces(templates_1.template_scene_include, scene);
        files.forEach(file => {
            const filepath = path_1.join(sceneDir, file);
            if (!filepath.endsWith(".c-stripe"))
                return;
            const jsonString = fs_1.readFileSync(filepath, "utf8");
            const data = JSON.parse(jsonString);
            reduced.declarations += helpers_1.removeBlankLines("\n" + (data.declarations || ""));
            reduced.on_awake += helpers_1.removeBlankLines("\n" + (data.on_awake || ""));
            reduced.on_enter += helpers_1.removeBlankLines("\n" + (data.on_enter || ""));
            reduced.on_frame += helpers_1.removeBlankLines("\n" + (data.on_frame || ""));
            reduced.on_exit += helpers_1.removeBlankLines("\n" + (data.on_exit || ""));
        });
        function applyReplaces(subject) {
            let mutable = applySceneReplaces(subject, scene);
            mutable = helpers_1.replaceAll(mutable, "{{declarations}}", reduced.declarations || "");
            mutable = helpers_1.replaceAll(mutable, "{{on_awake}}", reduced.on_awake || "");
            mutable = helpers_1.replaceAll(mutable, "{{on_enter}}", reduced.on_enter || "");
            mutable = helpers_1.replaceAll(mutable, "{{on_frame}}", reduced.on_frame || "");
            mutable = helpers_1.replaceAll(mutable, "{{on_exit}}", reduced.on_exit || "");
            return mutable;
        }
        let sceneCFile = yield astyle_1.default.format(applyReplaces(templates_1.template_scene_c));
        let sceneHFile = yield astyle_1.default.format(applyReplaces(templates_1.template_scene_h));
        return { hpp: sceneHFile, cpp: sceneCFile, encodedScene: reduced };
    });
}
// --- helpers
function applySceneReplaces(subject, scene) {
    let mutable = subject;
    mutable = helpers_1.replaceAll(mutable, "{{scene_name}}", scene.name);
    mutable = helpers_1.replaceAll(mutable, "{{uppercased_scene_name}}", scene.name.toUpperCase());
    mutable = helpers_1.replaceAll(mutable, "{{scene_id}}", " " + identifierForScene(scene));
    return mutable;
}
let sceneTokens = [];
function identifierForScene(scene) {
    let index = sceneTokens.indexOf(scene.name);
    if (index > -1)
        return index + 1;
    sceneTokens.push(scene.name);
    return sceneTokens.length;
}
