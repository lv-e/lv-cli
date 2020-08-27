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
exports.encodeShared = void 0;
const astyle_1 = __importDefault(require("astyle"));
const fs_1 = require("fs");
const path_1 = require("path");
const shelljs_1 = __importDefault(require("shelljs"));
const __1 = require("../..");
const helpers_1 = require("../../helpers/helpers");
const encode_1 = require("../encode");
const templates_1 = require("./templates");
function encodeShared(dirs) {
    return __awaiter(this, void 0, void 0, function* () {
        encodeSharedDirs(dirs);
        const response = yield mergeEncodedSharedFolder();
        const sourceDir = path_1.join(encode_1.outputDir, "lv-game");
        let hPath = path_1.join(sourceDir, "shared.h");
        helpers_1.createDirs(hPath);
        fs_1.writeFileSync(hPath, response.header);
        return response.encodedScene;
    });
}
exports.encodeShared = encodeShared;
function encodeSharedDirs(dirs) {
    dirs.map(dir => {
        encodeSharedDirs(dir.directories);
        dir.files.forEach(file => encodeSharedFile(file));
    });
}
function encodeSharedFile(file) {
    let encoders = encode_1.project.header.encoders;
    encoders.forEach(encoder => {
        if (encoder.extension == file.extension) {
            helpers_1.log(encode_1.vflag, "encoding file: " + file.name + " with " + encoder.npm_module);
            const outputFile = path_1.join(encode_1.outputDir, "artifacts", "shared", file.name + ".c-stripe");
            shelljs_1.default.exec(encoder.cli_command + " -i " + file.path + " -o " + outputFile);
        }
    });
}
function mergeEncodedSharedFolder() {
    return __awaiter(this, void 0, void 0, function* () {
        if (!fs_1.existsSync("")) {
            return { header: "// leave empty", encodedScene: __1.blankEncoded() };
        }
        const sharedFilesDir = path_1.join(encode_1.outputDir, "artifacts", "shared");
        helpers_1.log(encode_1.vflag, "reducing encoded shared files at " + sharedFilesDir);
        const files = fs_1.readdirSync(sharedFilesDir);
        let reduced = __1.blankEncoded();
        reduced.include_directive = templates_1.template_shared_include;
        files.forEach(file => {
            if (!file.endsWith(".c-stripe"))
                return;
            const filepath = path_1.join(sharedFilesDir, file);
            const jsonString = fs_1.readFileSync(filepath, "utf8");
            const data = JSON.parse(jsonString);
            reduced.declarations += helpers_1.removeBlankLines("\n" + (data.declarations || ""));
        });
        function applyReplaces(subject) {
            return helpers_1.replaceAll(subject, "{{declarations}}", reduced.declarations || "");
        }
        let sharedHeaderFile = yield astyle_1.default.format(applyReplaces(templates_1.template_shared_hpp));
        return { header: sharedHeaderFile, encodedScene: reduced };
    });
}
