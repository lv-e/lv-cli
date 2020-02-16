
// --- templates for scenes

export const template_scene_hpp = 
`
    static unsigned char {{uppercased_scene_name}} = {{scene_id}};

    void {{scene_name}}_on_awake();
    void {{scene_name}}_on_enter();
    void {{scene_name}}_on_frame();
    void {{scene_name}}_on_exit();
`

export const template_scene_cpp = 
`
    #include "{{scene_name}}.h"
    #include "shared.h"
    #include "lv/engine.h"

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
`

export const template_scene_include  = `#include "{{scene_name}}.h"`

// --- templates for shared folders

export const template_shared_hpp = 
`
#ifndef _SHARED_GUARD
#define _SHARED_GUARD

// shared declarations:

{{declarations}}

#endif
`

export const template_shared_include = `#include "shared.h"`

// --- templates for main

export const template_main_c = 
`
// + LV game engine +
// there's magic in these files <3

{{scene_includes}}

int main(){
    scene_main_on_enter();
    scene_main_on_frame();
    scene_main_on_exit();
    return 0;
}
`