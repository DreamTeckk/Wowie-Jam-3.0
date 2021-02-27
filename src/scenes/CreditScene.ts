const config: Phaser.Types.Scenes.SettingsConfig = {
    key: 'credit', // The key to provide to Phaser whene you want to change scene to this one
    visible: false,
    active: false // Defines if the Scene is active or not.
}

import { Scene } from 'phaser';

export default class CreditScene extends Scene {

    constructor() {
        super(config)
    }

    public preload(): void {
    }

    public create(): void {
    }

    /**
     * @param {number} time The current time. Either a High Resolution Timer value if it comes 
     * from Request Animation Frame, or Date.now if using SetTimeout.
     * @param {number} delta The delta time in ms since the last frame. 
     * This is a smoothed and capped value based on the FPS rate.
     */
    public update(time: number, delta: number): void {
    }
}