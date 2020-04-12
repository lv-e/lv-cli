"use strict";
// --- templates for scenes
Object.defineProperty(exports, "__esModule", { value: true });
exports.template_scene_hpp = `
    static unsigned char {{uppercased_scene_name}} = {{scene_id}};

    void {{scene_name}}_on_awake();
    void {{scene_name}}_on_enter();
    void {{scene_name}}_on_frame();
    void {{scene_name}}_on_exit();
`;
exports.template_scene_cpp = `
    #include "{{scene_name}}.hpp"
    #include "shared.hpp"
    #include "lv-engine/engine.hpp"

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
exports.template_scene_include = `#include "{{scene_name}}.hpp"`;
// --- templates for shared folders
exports.template_shared_hpp = `
#ifndef _SHARED_GUARD
#define _SHARED_GUARD

// shared declarations:

{{declarations}}

#endif
`;
exports.template_shared_include = `#include "shared.hpp"`;
// --- templates for main
exports.template_main_c = `
// + LV game engine +
// there's magic in these files <3

#include "lv-driver/driver.hpp"
#include "lv-engine/engine.hpp"
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
