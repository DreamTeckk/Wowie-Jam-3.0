const config: Phaser.Types.Scenes.SettingsConfig = {
    key: 'test', // The key to provide to Phaser whene you want to change scene to this one
    visible: false,
    active: false // Defines if the Scene is active or not.
}

import { Scene } from 'phaser';
import Activator from '../classes/Lever';
import Player from '../classes/Player';
import Spike from '../classes/Spike'
import Ghost from '../classes/Ghost'
import UsableObject from '../classes/UsableObject'


export default class TestScene extends Scene {

    private player: Player;
    private lever;
    private spikes: Phaser.Physics.Arcade.StaticGroup[] = [];
    private spikeTiles: Phaser.Types.Tilemaps.TiledObject[];
    private walls;
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

        map.setCollisionBetween(1, 999, true, true, this.walls);

        // Register the Player
        this.player = new Player(100, 200, this);
        this.player.create();

        // Register the Ghost
        this.ghost = new Ghost(100, 200, this/*, this.gameObjects*/);
        this.ghost.create();

        // Set wall layer as collinding layer
        map.setCollisionBetween(1, 999, true, true, this.walls);

        // Create collisions between Player and Walls
        this.physics.add.collider(this.player.player, this.walls);
        this.physics.add.collider(this.ghost.asset, this.walls);

        //Create spikes objects
        this.spikeTiles = map.getObjectLayer('Spikes').objects;

        //Add spikes into an array of Group
        this.spikeTiles.forEach(spike => {
            const d = new Spike(spike.x + spike.width / 2, spike.y - spike.height / 2, parseInt(spike.name), this);
            d.create();
            this.spikes.push(this.physics.add.staticGroup(d));
        });

        console.log(this.spikes)

        this.spikes.forEach(e => {
            this.physics.add.overlap(this.player.player, e, () => this.death(e));
            /*this.ghost.events.on('interact', (object) => {
                if (object === (e.children.entries[0] as UsableObject))
                    (e.children.entries[0] as UsableObject).actionGhost();

            });*/
        })


        const usableObjectsArr = [this.physics.add.staticGroup(new UsableObject(300, 300, this)), this.physics.add.staticGroup(new UsableObject(500, 500, this))]
        //this.gameObjects = this.physics.add.staticGroup(new UsableObject(300, 300, this))

        usableObjectsArr.forEach(e => {
            this.physics.add.overlap(this.ghost.asset, e, () => this.ghost.objectAction((e.children.entries[0] as UsableObject)));
            this.ghost.events.on('interact', (object) => {
                if (object === (e.children.entries[0] as UsableObject))
                    (e.children.entries[0] as UsableObject).actionGhost();
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

    public death(e): void {
        this.player.death((e.children.entries[0] as Spike));
        this.ghost.death();
        this.time.delayedCall(3000, () => this.revive(e), null, this);
    }

    public revive(e): void {
        this.player.revive();
        this.ghost.revive(this.player.player.x, this.player.player.y);
    }
}