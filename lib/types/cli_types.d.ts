declare module "lvcli" {
    type mode = ("run" | "help" | "verbose");
    type encoder = {
        extension: string;
        npm_module: string;
        command: string;
    };
    type encoded = {
        rom_data: string;
        declarations: string;
        on_enter: string;
        on_exit: string;
        on_frame: string;
    };
}
