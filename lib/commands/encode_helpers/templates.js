"use strict";
// --- templates for scenes
Object.defineProperty(exports, "__esModule", { value: true });
exports.template_lvk_h = exports.template_shared_include = exports.template_shared_hpp = exports.template_scene_include = exports.template_scene_c = exports.template_scene_h = void 0;
exports.template_scene_h = `
    #pragma once 

    static unsigned char {{uppercased_scene_name}} = {{scene_id}};
    void {{scene_name}}_setup();
    void {{scene_name}}_on_awake();
    void {{scene_name}}_on_enter();
    void {{scene_name}}_on_frame();
    void {{scene_name}}_on_exit();
`;
exports.template_scene_c = `
    #include "lv-game/{{scene_name}}.h"
    #include "lv-game/shared.h"
    #include "lv-engine/engine.h"

    {{declarations}}

    void {{scene_name}}_setup(){
        scenesTable[{{uppercased_scene_name}}] = {
            &{{scene_name}}_on_awake,
            &{{scene_name}}_on_enter,
            &{{scene_name}}_on_frame,
            &{{scene_name}}_on_exit
        };
    }
    
    void {{scene_name}}_on_awake(){
        {{on_awake}}
    }

    void {{scene_name}}_on_enter(){
        {{on_enter}}
    }

    void {{scene_name}}_on_frame(){
        {{on_frame}}
    }

    void {{scene_name}}_on_exit(){
        {{on_exit}}
    }
`;
exports.template_scene_include = `#include "lv-game/{{scene_name}}.h"`;
// --- templates for shared folders
exports.template_shared_hpp = `
#ifndef _SHARED_GUARD
#define _SHARED_GUARD

// shared declarations:

{{declarations}}

#endif
`;
exports.template_shared_include = `#include "lv-game/shared.h"`;
// --- templates for main
exports.template_lvk_h = `
// + LV game engine +
// there's magic in these files <3

#pragma once 

#ifndef lvk_scene_count
#define lvk_scene_count {{lvk_scene_count}}
#endif

#ifndef lvk_display_h
#define lvk_display_h {{lvk_display_h}}
#endif

#ifndef lvk_display_w
#define lvk_display_w {{lvk_display_w}}
#endif

#ifndef lvk_60hz
#define lvk_60hz 0
#endif

#ifndef lvk_measuring
#define lvk_measuring {{debug_mode}}
#endif
`;
