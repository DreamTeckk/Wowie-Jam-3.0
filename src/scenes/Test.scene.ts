const config: Phaser.Types.Scenes.SettingsConfig = {
    key: 'test', // The key to provide to Phaser whene you want to change scene to this one
    visible: false,
    active: false // Defines if the Scene is active or not.
}

import { Scene } from 'phaser';
import Activator from '../classes/Lever';
import Player from '../classes/Player';
import Ghost from '../classes/Ghost'
import FireballsLauncher from '../classes/FireballsLauncher'
import UsableObject from '../classes/UsableObject'


export default class TestScene extends Scene {

    private player: Player;
    private lever;
    private walls;
    private fireballLauncher : FireballsLauncher;
    private ghost: Ghost;
    private gameObjects: Phaser.Physics.Arcade.StaticGroup;

    constructor() {
        super(config)
    }

    public preload(): void {
        //Load Tiles & TileMap
        this.load.image('tiles', 'assets/images/tileset.png');
        this.load.tilemapTiledJSON('testmap', 'assets/tilemaps/test-map.json');

        // Load Player sprite
        this.load.spritesheet('player', 'assets/spritesheets/spritesheet.png', { frameWidth: 32, frameHeight: 32 });
        // Load Activator sprite
        this.load.spritesheet('activator', 'assets/spritesheets/activator.png', { frameWidth: 32, frameHeight: 32 });
        // Load Ghost sprite
        this.load.image('ghost', '/assets/images/ghost.png');
    }

    public create(): void {
        // Create the TileMap
        const map = this.make.tilemap({ key: 'testmap' })
        const tiles = map.addTilesetImage('tileset_test', 'tiles');

        // Display Map Layers 
        map.createLayer('Ground', tiles, 0, 0);
        this.walls = map.createLayer('Wall', tiles, 0, 0);
        map.createLayer('Door', tiles, 0, 0);

        // Register the Player
        this.player = new Player(100, 200, this);
        this.player.create();

        // Register the Ghost
        this.ghost = new Ghost(200, 200, this/*, this.gameObjects*/);
        this.ghost.create();

        // Set wall layer as collinding layer
        map.setCollisionBetween(1, 999, true, true, this.walls);

        // Create collisions between Player and Walls
        this.physics.add.collider(this.player.player, this.walls);

        //Lever
        this.lever = new Activator(400, 400, this);
        this.lever.create();

        const arr = [this.physics.add.staticGroup(new UsableObject(300, 300, this)), this.physics.add.staticGroup(new UsableObject(500, 500, this))]
        //this.gameObjects = this.physics.add.staticGroup(new UsableObject(300, 300, this))

        arr.forEach(e => {
            this.physics.add.overlap(this.ghost.asset, e, () => this.ghost.objectAction((e.children.entries[0] as UsableObject)));
            this.ghost.events.on('interact', (object) => {
                if (object === (e.children.entries[0] as UsableObject))
                    (e.children.entries[0] as UsableObject).actionGhost();

            });
        })

        this.fireballLauncher = new FireballsLauncher(250,150,this, this.walls,'W')
        this.fireballLauncher.create()
        this.physics.add.collider(this.fireballLauncher.fireballs, this.walls, (fireball) => fireball.destroy())
        this.physics.add.collider(this.player.player, this.fireballLauncher.fireballs, (player, fireball) => {console.log('you die'); fireball.destroy()})
        this.ghost.events.on('interact', (object) => {
            //
        })
        // this.physics.add.overlap(this.ghost.asset, this.gameObjects, (object) => this.ghost.objectAction(object));

    }
    /**
     * @param {number} time The current time. Either a High Resolution Timer value if it comes 
     * from Request Animation Frame, or Date.now if using SetTimeout.
     * @param {number} delta The delta time in ms since the last frame. 
     * This is a smoothed and capped value based on the FPS rate.
     */
    public update(time: number, delta: number): void {
        this.player.update();
        this.ghost.update();
    }
}