export declare const template_scene_h = "\n    #pragma once \n\n    static unsigned char {{uppercased_scene_name}} = {{scene_id}};\n    void {{scene_name}}_setup();\n    void {{scene_name}}_on_awake();\n    void {{scene_name}}_on_enter();\n    void {{scene_name}}_on_frame();\n    void {{scene_name}}_on_exit();\n";
export declare const template_scene_c = "\n    #include \"lv-game/{{scene_name}}.h\"\n    #include \"lv-game/shared.h\"\n    #include \"lv-engine/engine.h\"\n\n    {{declarations}}\n\n    void {{scene_name}}_setup(){\n        scenesTable[{{uppercased_scene_name}}] = {\n            &{{scene_name}}_on_awake,\n            &{{scene_name}}_on_enter,\n            &{{scene_name}}_on_frame,\n            &{{scene_name}}_on_exit\n        };\n    }\n    \n    void {{scene_name}}_on_awake(){\n        {{on_awake}}\n    }\n\n    void {{scene_name}}_on_enter(){\n        {{on_enter}}\n    }\n\n    void {{scene_name}}_on_frame(){\n        {{on_frame}}\n    }\n\n    void {{scene_name}}_on_exit(){\n        {{on_exit}}\n    }\n";
export declare const template_scene_include = "#include \"lv-game/{{scene_name}}.h\"";
export declare const template_shared_hpp = "\n#ifndef _SHARED_GUARD\n#define _SHARED_GUARD\n\n// shared declarations:\n\n{{declarations}}\n\n#endif\n";
export declare const template_shared_include = "#include \"lv-game/shared.h\"";
export declare const template_main_c = "\n// + LV game engine +\n// there's magic in these files <3\n\n#include \"lv-driver/driver.h\"\n#include \"lv-engine/engine.h\"\n{{scene_includes}}\n\nint main(){\n\n    lvInit();\n    lv.system.draw();\n\n    scene_main_on_enter();\n    for(int i = 0; i < 10; i ++) scene_main_on_frame();\n    scene_main_on_exit();\n\n    return 0;\n}\n";
