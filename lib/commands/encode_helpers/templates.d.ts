export declare const template_scene_hpp = "\n    static unsigned char {{uppercased_scene_name}} = {{scene_id}};\n\n    void {{scene_name}}_on_awake();\n    void {{scene_name}}_on_enter();\n    void {{scene_name}}_on_frame();\n    void {{scene_name}}_on_exit();\n";
export declare const template_scene_cpp = "\n    #include \"{{scene_name}}.h\"\n    #include \"shared.h\"\n    #include \"lv/engine.h\"\n\n    {{declarations}}\n    \n    void {{scene_name}}_on_awake(){\n        {{on_awake}}\n    }\n\n    void {{scene_name}}_on_enter(){\n        {{on_enter}}\n    }\n\n    void {{scene_name}}_on_frame(){\n        {{on_frame}}\n    }\n\n    void {{scene_name}}_on_exit(){\n        {{on_exit}}\n    }\n";
export declare const template_scene_include = "#include \"{{scene_name}}.h\"";
export declare const template_shared_hpp = "\n#ifndef _SHARED_GUARD\n#define _SHARED_GUARD\n\n// shared declarations:\n\n{{declarations}}\n\n#endif\n";
export declare const template_shared_include = "#include \"shared.h\"";
export declare const template_main_c = "\n// + LV game engine +\n// there's magic in these files <3\n\n{{scene_includes}}\n\nint main(){\n    scene_main_on_enter();\n    scene_main_on_frame();\n    scene_main_on_exit();\n    return 0;\n}\n";
