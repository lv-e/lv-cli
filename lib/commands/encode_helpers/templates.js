"use strict";
// --- templates for scenes
Object.defineProperty(exports, "__esModule", { value: true });
exports.template_main_c = exports.template_shared_include = exports.template_shared_hpp = exports.template_scene_include = exports.template_scene_c = exports.template_scene_h = void 0;
exports.template_scene_h = `
    static unsigned char {{uppercased_scene_name}} = {{scene_id}};

    void {{scene_name}}_on_awake();
    void {{scene_name}}_on_enter();
    void {{scene_name}}_on_frame();
    void {{scene_name}}_on_exit();
`;
exports.template_scene_c = `
    #include "{{scene_name}}.h"
    #include "shared.h"
    #include "lv-engine/engine.h"

    {{declarations}}
    
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
exports.template_scene_include = `#include "{{scene_name}}.h"`;
// --- templates for shared folders
exports.template_shared_hpp = `
#ifndef _SHARED_GUARD
#define _SHARED_GUARD

// shared declarations:

{{declarations}}

#endif
`;
exports.template_shared_include = `#include "shared.h"`;
// --- templates for main
exports.template_main_c = `
// + LV game engine +
// there's magic in these files <3

#include "lv-driver/driver.h"
#include "lv-engine/engine.h"
{{scene_includes}}

int main(){

    lvInit();
    lv.system.draw();

    scene_main_on_enter();
    for(int i = 0; i < 10; i ++) scene_main_on_frame();
    scene_main_on_exit();

    return 0;
}
`;
