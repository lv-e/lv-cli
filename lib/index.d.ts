#!/usr/bin/env node
export declare type mode = ("run" | "help" | "verbose");
export declare type driver = {
    name: string;
    docker_image: string;
    cli_command: string;
    current?: boolean;
};
export declare type encoder = {
    extension: string;
    npm_module: string;
    auto_update: boolean;
    cli_command: string;
};
export declare type encoded = {
    declarations: (string | null);
    include_directive: (string | null);
    on_awake: (string | null);
    on_enter: (string | null);
    on_exit: (string | null);
    on_frame: (string | null);
};
export declare function blankEncoded(): encoded;
export declare type fileMap = {
    path: string;
    name: string;
    extension: string;
};
export declare type dirMap = {
    files: fileMap[];
    path: string;
    name: string;
    directories: dirMap[];
};
export declare type sceneMap = dirMap;
export declare type engineDefinition = {
    repo: string;
    tag: string;
};
export declare type projectContent = {
    header: {
        version: string;
        engine: engineDefinition;
        drivers: driver[];
        encoders: encoder[];
    };
};
export declare type rootFolders = {
    scenes: sceneMap[];
    shared: dirMap[];
    unused: dirMap[];
    project_file: fileMap;
    generated_at: string;
};
