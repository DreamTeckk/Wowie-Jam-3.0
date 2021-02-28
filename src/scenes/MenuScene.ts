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
        //background loading
        this.load.image('backgrondMainMenu', 'assets/images/backgrondMainMenu.png');
        
        //theme menu loading
        this.load.audio('theme', [
            'assets/sounds/menu.wav'
        ]);

        //buttons loading
        this.load.image('buttonPlay', 'assets/images/buttons/buttonPlay.png');
        this.load.image('buttonCredits', 'assets/images/buttons/buttonCredits.png');
        this.load.image('buttonHow', 'assets/images/buttons/buttonHow.png');
    }
    

    public create(): void {
        //this.add.image(this.game.config.width as integer/2, this.game.config.height as integer/2,'backgrondMainMenu')
        let music = this.sound.add('theme');
        let playButton = this.add.image(this.game.config.width as integer/2, this.game.config.height as integer/2-64, 'buttonPlay').setInteractive()
        playButton.once('pointerdown', () => {
            //console.log(this)
            music.stop()
            this.scene.start('test')
        }, this)
        let creditsButton = this.add.image(this.game.config.width as integer/2, this.game.config.height as integer/2+16, 'buttonCredits').setInteractive()
        playButton.once('pointerdown', () => {
            //console.log(this)
            music.stop()
            this.scene.start('test')
        }, this)
        let howButton = this.add.image(this.game.config.width as integer/2, this.game.config.height as integer/2+96, 'buttonHow').setInteractive()
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