const config: Phaser.Types.Scenes.SettingsConfig = {
    key: 'myScene', // The key to provide to Phaser whene you want to change scene to this one
    visible: false, 
    active: false // Defines if the Scene is active or not.
}

import { Scene } from 'phaser';
import Activator from '../classes/Activator';
import Player from '../classes/Player';


export default class MyScene extends Phaser.Scene {

    private _player;
    private _lever;
    
    constructor() {
        super(config)
    }

    public preload(): void {
        this.load.spritesheet('player', 'assets/spritesheets/spritesheet.png', { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('activator', 'assets/spritesheets/activator.png', { frameWidth: 32, frameHeight: 32 });
    }

    public create(): void {
        /**
         * The create() method is called after the preload() method has finished loading all the assets.
         * Here we can call the create() methods of our others Classes and add the logic to setup the 
         * decorations of our Scene.   
         */
        this._player = new Player(100, 100, this);
        this._player.create();

        this._lever = new Activator(400, 400, this);
        this._lever.create();
    }

    /**
     * @param {number} time The current time. Either a High Resolution Timer value if it comes 
     * from Request Animation Frame, or Date.now if using SetTimeout.
     * @param {number} delta The delta time in ms since the last frame. 
     * This is a smoothed and capped value based on the FPS rate.
     */
    public update(time: number, delta: number): void {
        /**
         * The update() method is called every frame while the scene is active. 
         * It should containes your classes update() method and the update of your scene.
         */
        this._player.update();
    }
}