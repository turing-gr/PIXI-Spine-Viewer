import * as PIXI from 'pixi.js'
import { Spine } from 'pixi-spine';

const app = new PIXI.Application (
    {
        width: 800,
        height: 800
    }
);

export function loadPixiSpine() {
    document.body.appendChild(app.view);
    return app;
}

export function playAnimation(aux_object) {
    var final_json_file_name = aux_object.json_file_name.replace(/\.[^/.]+$/, "");
    var final_json_file_path = aux_object.file.path.replaceAll("\\", "/");
    app.loader.add(final_json_file_name, final_json_file_path);
    app.loader.load(onAssetsLoaded);
    function onAssetsLoaded(loader, resources) {
        const symbol_animation = new Spine(resources[final_json_file_name].spineData);
        symbol_animation.x = app.screen.width-app.screen.width / 2;
        symbol_animation.y = app.screen.height-app.screen.height / 2 - 70;
        symbol_animation.scale.set(1);
        symbol_animation.state.timeScale = Number(aux_object.animation_speed);
        symbol_animation.state.setAnimation(0, aux_object.selected_animation, aux_object.current_animation_play_loop);
        app.stage.addChild(symbol_animation);
        return symbol_animation;
    }
    PIXI.utils.clearTextureCache();
}

export function destroyAnimation() {
    app.loader.destroy();
    for (var i = app.stage.children.length - 1; i >= 0; i--) 
        app.stage.removeChild(app.stage.children[i]);
}

export function pauseCurrentPlayingAnimation(animation_speed) {
    let current_playing_animation_scale = app.stage.children[0].state.timeScale;
    if(current_playing_animation_scale == 0)
        app.stage.children[0].state.timeScale = Number(animation_speed);
    else
        app.stage.children[0].state.timeScale = Number(0);
}

export function scaleXCurrentPlayingAnimation(scale_x_value) {
    app.stage.children[0].scale.x = scale_x_value;
    return scale_x_value;
}

export function scaleYCurrentPlayingAnimation(scale_y_value) {
    app.stage.children[0].scale.y = scale_y_value;
    return scale_y_value;
}

export function changeAlphaCurrentPlayingAnimation(alpha_value) {
    app.stage.children[0].alpha = alpha_value;
    return alpha_value;
}