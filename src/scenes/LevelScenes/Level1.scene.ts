const config: Phaser.Types.Scenes.SettingsConfig = {
    key: 'level-1', // The key to provide to Phaser whene you want to change scene to this one
    visible: false,
    active: false // Defines if the Scene is active or not.
}

import { Scene } from 'phaser';
import SceneFactory from '../../factories/Scene.factory';

export default class Level1Scene extends Scene {

    private sceneFactory: SceneFactory = new SceneFactory(this);

    constructor() {
        super(config)
    }

    public preload(): void {
        this.sceneFactory.prelaod();
    }

    public create(): void {
        this.sceneFactory.create();
        this.add.text(850, 2180, 'Welcome to "To Die or Not Today"', { fontFamily: 'Arial', fontSize: '16px', color: '#000000' });
        this.add.text(850, 2210, 'Use Arrows to move and Space to interact', { fontFamily: 'Arial', fontSize: '16px', color: '#000000' });
        this.add.text(1300, 2180, 'In front of you are traps, if you touch them you will die...', { fontFamily: 'Arial', fontSize: '16px', color: '#000000' });
        this.add.text(1300, 2210, '...But your ghost might be able to go trough doors', { fontFamily: 'Arial', fontSize: '16px', color: '#000000' });
        this.add.text(1840, 2180, '<-- This is the end of a level', { fontFamily: 'Arial', fontSize: '16px', color: '#000000' });
        this.add.text(1870, 2210, 'but you cannot reach it as a ghost', { fontFamily: 'Arial', fontSize: '16px', color: '#000000' });
        this.add.text(1950, 2065, 'This is a teleporter -->', { fontFamily: 'Arial', fontSize: '16px', color: '#000000' });
        this.add.text(1950, 2095, 'Try pressing "Space" on it', { fontFamily: 'Arial', fontSize: '16px', color: '#000000' });
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