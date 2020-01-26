import { mode } from "lvcli";
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
export interface SceneMap extends DirMap {
}
export interface RootFolders {
    scenes: SceneMap[];
    shared: DirMap[];
    unused: DirMap[];
    generated_at: String;
}
export declare function scan(inputFolder: string, outputFile: string, mode?: mode): void;
export declare function root_folders(root: string): RootFolders;
