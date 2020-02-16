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
const __1 = require("../..");
const encode_1 = require("../encode");
const path_1 = require("path");
const shelljs_1 = __importDefault(require("shelljs"));
const astyle_1 = __importDefault(require("astyle"));
const helpers_1 = require("../../helpers/helpers");
const fs_1 = require("fs");
const templates_1 = require("./templates");
function encodeSharedDir(dir) {
    return __awaiter(this, void 0, void 0, function* () {
        dir.directories.forEach(dir => encodeSharedDir(dir));
        dir.files.forEach(file => encodeSharedFile(file));
        const response = yield mergeEncodedSharedFolder();
        const sourceDir = path_1.join(encode_1.outputDir, "source");
        let hppPath = path_1.join(sourceDir, "shared.h");
        helpers_1.createDirs(hppPath);
        fs_1.writeFileSync(hppPath, response.hpp);
        return response.encodedScene;
    });
}
exports.encodeSharedDir = encodeSharedDir;
function encodeSharedFile(file) {
    let encoders = encode_1.project.header.encoders;
    encoders.forEach(encoder => {
        if (encoder.extension == file.extension) {
            helpers_1.log(encode_1.vflag, "encoding file: " + file.name + " with " + encoder.npm_module);
            const outputFile = path_1.join(encode_1.outputDir, "shared", "h-stripes", file.name + ".h-stripe");
            shelljs_1.default.exec(encoder.cli_command + " -i " + file.path + " -o " + outputFile);
        }
    });
}
function mergeEncodedSharedFolder() {
    return __awaiter(this, void 0, void 0, function* () {
        const sharedFilesDir = path_1.join(encode_1.outputDir, "shared", "h-stripes");
        helpers_1.log(encode_1.vflag, "reducing encoded shared files at " + sharedFilesDir);
        const files = fs_1.readdirSync(sharedFilesDir);
        let reduced = __1.blankEncoded();
        reduced.include_directive = templates_1.template_shared_include;
        files.forEach(file => {
            const filepath = path_1.join(sharedFilesDir, file);
            const jsonString = fs_1.readFileSync(filepath, "utf8");
            const data = JSON.parse(jsonString);
            reduced.declarations += helpers_1.removeBlankLines("\n" + (data.declarations || ""));
        });
        function applyReplaces(subject) {
            return helpers_1.replaceAll(subject, "{{declarations}}", reduced.declarations || "");
        }
        let sharedHPPFile = yield astyle_1.default.format(applyReplaces(templates_1.template_shared_hpp));
        return { hpp: sharedHPPFile, encodedScene: reduced };
    });
}