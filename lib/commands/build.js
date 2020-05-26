"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.build = exports.outputDir = exports.vflag = void 0;
const helpers_1 = require("../helpers/helpers");
const shelljs_1 = __importDefault(require("shelljs"));
const helpText = `
'build' will invoke build.sh script. later it can be used to parameterize builds.
`;
exports.vflag = false;
function build(input, output, mode = "run") {
    if (mode == "help")
        helpers_1.log(true, helpText);
    else {
        exports.vflag = mode == "verbose" ? true : false;
        helpers_1.log(exports.vflag, "[command] " + "build");
        const command = "." + input;
        helpers_1.log(exports.vflag, "will run: " + command);
        shelljs_1.default.exec(command);
    }
}
exports.build = build;
