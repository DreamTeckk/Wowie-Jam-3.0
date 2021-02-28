const config: Phaser.Types.Scenes.SettingsConfig = {
    key: 'menuScene', // The key to provide to Phaser whene you want to change scene to this one
    visible: false, 
    active: false // Defines if the Scene is active or not.
}

import { Scene } from 'phaser';
import TestScene from './Test.scene'
import Ghost from '../classes/Ghost'


export default class MenuScene extends Phaser.Scene {
    
    constructor() {
        super(config)
    }

    public preload(): void {
        this.load.image('backgrondMainMenu', 'assets/images/backgrondMainMenu.png');
        this.load.audio('themeMenu', [
            'assets/sounds/menu.wav'
        ]);
    }
        /**
         *  The preload() method is used to load all the assets before the game starts.
         *  It's used to prevent the game to start with missing or unload images, spritesheets, etc.. 
         */
    

    public create(): void {
        //this.add.image(this.game.config.width as integer/2, this.game.config.height as integer/2,'backgrondMainMenu')
        let music = this.sound.add('themeMenu');
        let playButton = this.add.image(this.game.config.width as integer/2, this.game.config.height as integer/2, 'PlayButton').setInteractive()
        playButton.once('pointerdown', () => {
            //console.log(this)
            music.stop()
            this.scene.start('test')
        }, this)

        music.play();
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
    }
}