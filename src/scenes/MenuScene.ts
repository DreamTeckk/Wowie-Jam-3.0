const config: Phaser.Types.Scenes.SettingsConfig = {
    key: 'menuScene', // The key to provide to Phaser whene you want to change scene to this one
    visible: false,
    active: false // Defines if the Scene is active or not.
}

export default class MenuScene extends Phaser.Scene {

    constructor() {
        super(config)
    }

    public preload(): void {
        this.load.spritesheet('play_button', 'assets/images/ui/play_button.png', { frameWidth: 310, frameHeight: 116, endFrame: 2 });
        this.load.spritesheet('credits_button', 'assets/images/ui/credits_button.png', { frameWidth: 310, frameHeight: 116, endFrame: 2 });
        this.load.spritesheet('title', 'assets/images/ui/title.png', { frameWidth: 870, frameHeight: 360, endFrame: 0 });
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
        this.game.registry.set('idLevel', 1);
        //this.add.image(this.game.config.width as integer/2, this.game.config.height as integer/2,'backgrondMainMenu')
        const music = this.sound.add('themeMenu', { loop: true, volume: 0.2 });
        music.play();
        const playButton = this.add.sprite(this.game.config.width as integer / 2, this.game.config.height as integer / 2, 'play_button').setInteractive()
        const creditsButton = this.add.sprite(this.game.config.width as integer / 2, this.game.config.height as integer / 2 + 150, 'credits_button').setInteractive()
        this.add.sprite(this.game.config.width as integer / 2, 200, 'title')
        playButton.on('pointerover', () => {
            playButton.setFrame(1);
        });
        playButton.on('pointerout', () => {
            playButton.setFrame(0);
        });
        playButton.once('pointerdown', () => {
            playButton.setFrame(2)
            playButton.once('pointerup', () => {
                music.stop()
                this.registry.set('themeMusic', this.sound.add('themeGame', { loop: true, volume: 0.1 }));
                (this.registry.get('themeMusic') as Phaser.Sound.BaseSound).play()
                this.scene.start('level-1')
            })
        })

        creditsButton.on('pointerover', () => {
            creditsButton.setFrame(1);
        });
        creditsButton.on('pointerout', () => {
            creditsButton.setFrame(0);
        });
        creditsButton.once('pointerdown', () => {
            creditsButton.setFrame(2)
            creditsButton.once('pointerup', () => {
                music.stop()
                this.scene.start('creditScene')
            })
        })

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