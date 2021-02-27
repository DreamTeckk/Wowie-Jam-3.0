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
import Door from '../classes/Door';
import Lever from '../classes/Lever';


export default class TestScene extends Scene {

    private player: Player;
    private lever: Lever;
    private walls;
    private ghost: Ghost;
    private doorTiles: Phaser.Types.Tilemaps.TiledObject[];
    private leverTiles: Phaser.Types.Tilemaps.TiledObject[];
    private doors: Door[] = [];
    private levers: Lever[] = [];

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
        this.doorTiles = map.getObjectLayer('Door').objects;
        this.leverTiles = map.getObjectLayer('Lever').objects;

        // Display levers
        this.leverTiles.forEach(lever => {
            const l = new Activator(lever.x + lever.width / 2, lever.y - lever.height / 2, parseInt(lever.name), this);
            l.create();
            this.levers.push(l);
        });

        // Display doors 
        this.doorTiles.forEach(door => {
            const d = new Door(door.x + door.width / 2, door.y - door.height / 2, parseInt(door.name), this);
            d.create();
            this.levers.filter(l => l.id === d.id)[0].event.on('activate', () => !d.opened ? d.open() : null)
            this.doors.push(d);
        });

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


        //const arr = [this.physics.add.staticGroup(new UsableObject(300, 300, this)), this.physics.add.staticGroup(new UsableObject(500, 500, this))]
        //this.gameObjects = this.physics.add.staticGroup(new UsableObject(300, 300, this))

        this.levers.map(l => this.physics.add.staticGroup(l)).forEach(e => {
            this.physics.add.overlap(this.ghost.asset, e, () => this.ghost.objectAction((e.children.entries[0] as Activator)));
            this.ghost.events.on('interact', (object) => {
                if (object === (e.children.entries[0] as Activator))
                    (e.children.entries[0] as Activator).actionGhost();

            });
        })

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
        this.ghost.update()
    }
}