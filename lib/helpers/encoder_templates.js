"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.template_hpp = `
    #include <stdio.h>
    
    static unsigned char {{uppercased_scene_name}} = {{scene_id}};

    void {{scene_name}}_on_awake();
    void {{scene_name}}_on_enter();
    void {{scene_name}}_on_frame();
    void {{scene_name}}_on_exit();
`;
exports.template_cpp = `
    #include "{{scene_name}}.h"

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
