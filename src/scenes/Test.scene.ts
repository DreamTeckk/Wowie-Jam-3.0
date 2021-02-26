const config: Phaser.Types.Scenes.SettingsConfig = {
    key: 'test', // The key to provide to Phaser whene you want to change scene to this one
    visible: false,
    active: false // Defines if the Scene is active or not.
}

import { Scene } from 'phaser';
import Activator from '../classes/Lever';
import Player from '../classes/Player';
import Ghost from '../classes/Ghost'
import UsableObject from '../classes/UsableObject'


export default class TestScene extends Scene {

    private player;
    private _lever;
    private _walls;
    private _ghost
    private _gameObjects;

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

        //GameObject
        this.load.image('ghost', '/assets/images/ghost.png');

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
        this.player = new Player(100, 200, this);
        this.player.create();

        this.physics.add.collider(this.player._body, this._walls);


        //Lever
        this._lever = new Activator(400, 400, this);
        this._lever.create();
        this._gameObjects = this.physics.add.staticGroup(new UsableObject(300, 300, this))
        this._ghost = new Ghost(400, 400, this, this._gameObjects);
    }
    /**
     * @param {number} time The current time. Either a High Resolution Timer value if it comes 
     * from Request Animation Frame, or Date.now if using SetTimeout.
     * @param {number} delta The delta time in ms since the last frame. 
     * This is a smoothed and capped value based on the FPS rate.
     */
    public update(time: number, delta: number): void {
        this.player.update();
        this._ghost.update()
    }
}