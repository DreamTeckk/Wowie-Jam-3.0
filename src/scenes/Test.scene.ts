const config: Phaser.Types.Scenes.SettingsConfig = {
    key: 'test', // The key to provide to Phaser whene you want to change scene to this one
    visible: false,
    active: false // Defines if the Scene is active or not.
}

import { Scene } from 'phaser';
import Activator from '../classes/Lever';
import Player from '../classes/Player';


export default class TestScene extends Scene {

    private _player;
    private _lever;


    private _player2;


    private _walls;

    constructor() {
        super(config)
    }

    get walls(): Phaser.Tilemaps.TilemapLayer {
        return this._walls;
    }

    public preload(): void {
        //TileMap
        this.load.image('tiles', 'assets/images/tileset.png');
        this.load.tilemapTiledJSON('testmap', 'assets/tilemaps/test-map.json');

        //Player
        this.load.spritesheet('player', 'assets/spritesheets/spritesheet.png', { frameWidth: 32, frameHeight: 32 });

        //Objects
        this.load.spritesheet('activator', 'assets/spritesheets/activator.png', { frameWidth: 32, frameHeight: 32 });
    }

    public create(): void {
        //TileMap
        const map = this.make.tilemap({ key: 'testmap' })
        const tiles = map.addTilesetImage('tileset_test', 'tiles');

        map.createLayer('Ground', tiles, 0, 0);
        this._walls = map.createLayer('Wall', tiles, 0, 0);
        map.createLayer('Door', tiles, 0, 0);

        map.setCollisionBetween(1, 999, true, true, this._walls);

        //Player
        this._player = new Player(100, 200, this);
        this._player.create();

        this._player2 = this.physics.add.sprite(100, 400, 'player');

        console.log(this._player2);

        console.log(this._player);

        this.physics.add.collider(this._player, this._walls);

        

        //Lever
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
        this._player.update();
    }
}