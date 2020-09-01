export declare const template_scene_h = "\n    #pragma once \n\n    static unsigned char {{uppercased_scene_name}} = {{scene_id}};\n    void {{scene_name}}_setup();\n    void {{scene_name}}_on_awake();\n    void {{scene_name}}_on_enter();\n    void {{scene_name}}_on_frame();\n    void {{scene_name}}_on_exit();\n";
export declare const template_scene_c = "\n    #include \"lv-game/{{scene_name}}.h\"\n    #include \"lv-game/shared.h\"\n    #include \"lv-engine/engine.h\"\n\n    {{declarations}}\n\n    void {{scene_name}}_setup(){\n        scenesTable[{{uppercased_scene_name}}] = {\n            &{{scene_name}}_on_awake,\n            &{{scene_name}}_on_enter,\n            &{{scene_name}}_on_frame,\n            &{{scene_name}}_on_exit\n        };\n    }\n    \n    void {{scene_name}}_on_awake(){\n        {{on_awake}}\n    }\n\n    void {{scene_name}}_on_enter(){\n        {{on_enter}}\n    }\n\n    void {{scene_name}}_on_frame(){\n        {{on_frame}}\n    }\n\n    void {{scene_name}}_on_exit(){\n        {{on_exit}}\n    }\n";
export declare const template_scene_include = "#include \"lv-game/{{scene_name}}.h\"";
export declare const template_shared_hpp = "\n#ifndef _SHARED_GUARD\n#define _SHARED_GUARD\n\n// shared declarations:\n\n{{declarations}}\n\n#endif\n";
export declare const template_shared_include = "#include \"lv-game/shared.h\"";
export declare const template_lvk_h = "\n// + LV game engine +\n// there's magic in these files <3\n\n#pragma once \n\n#ifndef lvk_scene_count\n#define lvk_scene_count {{lvk_scene_count}}\n#endif\n\n#ifndef lvk_display_h\n#define lvk_display_h {{lvk_display_h}}\n#endif\n\n#ifndef lvk_display_w\n#define lvk_display_w {{lvk_display_w}}\n#endif\n\n#ifndef lvk_octaspixels_per_line\n#define lvk_octaspixels_per_line 17\n#endif\n";
