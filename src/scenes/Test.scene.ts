const config: Phaser.Types.Scenes.SettingsConfig = {
    key: 'test', // The key to provide to Phaser whene you want to change scene to this one
    visible: false,
    active: false // Defines if the Scene is active or not.
}

import { Scene } from 'phaser';


export default class TestScene extends Scene {

    constructor() {
        super(config)
    }

    public preload(): void {
        this.load.image('tiles', 'assets/images/tileset.png');
        this.load.tilemapTiledJSON('testmap', 'assets/tilemaps/test-map.json');
    }

    public create(): void {
        const map = this.make.tilemap({ key: 'testmap' })
        const tiles = map.addTilesetImage('tileset_test', 'tiles');

        map.createLayer('Ground', tiles, 0, 0);
        map.createLayer('Wall', tiles, 0, 0);
        map.createLayer('Door', tiles, 0, 0);
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