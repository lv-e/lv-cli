import { projectContent } from "..";
import { mode } from "../index";
export declare let vflag: boolean;
export declare let outputDir: string;
export declare let project: projectContent;
export declare function reduce(input: string, output: string, mode: mode): Promise<void>;
