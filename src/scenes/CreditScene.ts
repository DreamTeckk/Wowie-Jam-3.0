const config: Phaser.Types.Scenes.SettingsConfig = {
    key: 'creditScene', // The key to provide to Phaser whene you want to change scene to this one
    visible: false,
    active: false // Defines if the Scene is active or not.
}

export default class CreditScene extends Phaser.Scene {

    constructor() {
        super(config)
    }

    public preload(): void {
        this.load.spritesheet('play_button', 'assets/images/ui/play_button.png', { frameWidth: 310, frameHeight: 116, endFrame: 2 });
        this.load.image('backgrondMainMenu', 'assets/images/backgrondMainMenu.png');
        this.load.audio('themeMenu', [
            'assets/sounds/menu.wav'
        ]);
        this.load.audio('themeGame', 'assets/sounds/gameTheme.mp3');

    }
    /**
     *  The preload() method is used to load all the assets before the game starts.
     *  It's used to prevent the game to start with missing or unload images, spritesheets, etc.. 
     */


    public create(): void {
        //this.add.image(this.game.config.width as integer/2, this.game.config.height as integer/2,'backgrondMainMenu')
        const music = this.sound.add('themeMenu', { loop: true, volume: 0.2 });
        music.play();
        const backButton = this.add.sprite(this.game.config.width as integer / 2, this.game.config.height as integer / 2, 'play_button').setInteractive()

        backButton.on('pointerover', () => {
            backButton.setFrame(1);
        });
        backButton.on('pointerout', () => {
            backButton.setFrame(0);
        });
        backButton.once('pointerdown', () => {
            backButton.setFrame(2)
            backButton.once('pointerup', () => {
                music.stop()
                this.scene.start('menuScene')
            })
        })

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