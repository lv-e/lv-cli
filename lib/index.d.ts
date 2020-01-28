#!/usr/bin/env node
export declare type mode = ("run" | "help" | "verbose");
export declare type encoder = {
    extension: string;
    npm_module: string;
    command: string;
};
export declare type encoded = {
    declarations: string;
    on_awake: string;
    on_enter: string;
    on_exit: string;
    on_frame: string;
};
