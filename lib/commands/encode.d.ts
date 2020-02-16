import { mode, projectContent } from "../index";
export declare let vflag: boolean;
export declare let outputDir: string;
export declare let project: projectContent;
export declare function encode(input: string, output: string, mode: mode): Promise<void>;
