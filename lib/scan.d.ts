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
}
export declare function scan(folder: string): RootFolders;
export declare function root_folders(root: string): RootFolders;
