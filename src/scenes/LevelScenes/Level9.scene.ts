const config: Phaser.Types.Scenes.SettingsConfig = {
    key: 'end', // The key to provide to Phaser whene you want to change scene to this one
    visible: false,
    active: false // Defines if the Scene is active or not.
}

import { Scene } from 'phaser';

export default class Level9Scene extends Scene {


    constructor() {
        super(config)
    }

    public preload(): void {
        //
    }

    public create(): void {
        this.add.text(this.game.config.width as integer / 2 - 100, this.game.config.height as integer / 2 - 100, 'GG', { fontFamily: 'Arial', fontSize: '100px', color: '#000000' }).setOrigin(0, 0);
    }
    /**
     * @param {number} time The current time. Either a High Resolution Timer value if it comes 
     * from Request Animation Frame, or Date.now if using SetTimeout.
     * @param {number} delta The delta time in ms since the last frame. 
     * This is a smoothed and capped value based on the FPS rate.
     */
    public update(time: number, delta: number): void {
        //
    }
}