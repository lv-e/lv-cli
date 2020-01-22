import { Mode } from "..";
export interface Encoder {
    extension: string;
    npm_module: string;
}
export interface Encoded {
    rom_data: string;
    declaration: string;
    on_enter: string;
    on_exit: string;
    on_frame: string;
}
export declare function encode(input: string, output: string, mode: Mode): void;
