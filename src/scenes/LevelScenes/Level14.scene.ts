const config: Phaser.Types.Scenes.SettingsConfig = {
    key: 'level-14', // The key to provide to Phaser whene you want to change scene to this one
    visible: false,
    active: false // Defines if the Scene is active or not.
}

import { Scene } from 'phaser';
import SceneFactory from '../../factories/Scene.factory';

export default class Level14Scene extends Scene {

    private sceneFactory: SceneFactory = new SceneFactory(this);

    constructor() {
        super(config)
    }

    public preload(): void {
        this.sceneFactory.prelaod();
    }

    public create(): void {
        this.sceneFactory.create();
    }
    /**
     * @param {number} time The current time. Either a High Resolution Timer value if it comes 
     * from Request Animation Frame, or Date.now if using SetTimeout.
     * @param {number} delta The delta time in ms since the last frame. 
     * This is a smoothed and capped value based on the FPS rate.
     */
    public update(time: number, delta: number): void {
        this.sceneFactory.update();
    }
}