import { Mode } from "..";
export interface FileMap {
    path: String;
    name: String;
    extension: String;
}
export interface DirMap {
    files: FileMap[];
    path: String;
    name: String;
    directories: DirMap[];
}
export interface RootFolders {
    scenes: DirMap[];
    shared: DirMap[];
    unused: DirMap[];
    generated_at: String;
}
export declare function scan(inputFolder: string, outputFile: string, mode?: Mode): void;
export declare function root_folders(root: string, verbose: boolean): RootFolders;
