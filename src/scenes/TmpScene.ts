const config: Phaser.Types.Scenes.SettingsConfig = {
    key: 'tmpScene', // The key to provide to Phaser whene you want to change scene to this one
    visible: false, 
    active: false // Defines if the Scene is active or not.
}

import { Scene } from 'phaser';
import Ghost from '../classes/Ghost'


export default class TmpScene extends Phaser.Scene {
    
    private _gameObjects = [];
    constructor() {
        super(config)
    }

    public preload(): void {
        this.load.image('ghost', '/assets/images/ghost.png');
        /**
         *  The preload() method is used to load all the assets before the game starts.
         *  It's used to prevent the game to start with missing or unload images, spritesheets, etc.. 
         */
    }

    public create(): void {
        this._gameObjects.push(new Ghost(200,200,this));
        /**
         * The create() method is called after the preload() method has finished loading all the assets.
         * Here we can call the create() methods of our others Classes and add the logic to setup the 
         * decorations of our Scene.   
         */
    }

    /**
     * @param {number} time The current time. Either a High Resolution Timer value if it comes 
     * from Request Animation Frame, or Date.now if using SetTimeout.
     * @param {number} delta The delta time in ms since the last frame. 
     * This is a smoothed and capped value based on the FPS rate.
     */
    public update(time: number, delta: number): void {
        this._gameObjects.forEach(gameObject => gameObject.update());
        /**
         * The update() method is called every frame while the scene is active. 
         * It should containes your classes update() method and the update of your scene.
         */
    }
}