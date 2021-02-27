const config: Phaser.Types.Scenes.SettingsConfig = {
    key: 'test', // The key to provide to Phaser whene you want to change scene to this one
    visible: false,
    active: false // Defines if the Scene is active or not.
}

import { Scene } from 'phaser';
import Lever from '../classes/Lever';
import Player from '../classes/Player';
import Ghost from '../classes/Ghost'
import Door from '../classes/Door';


export default class TestScene extends Scene {

    private player: Player;
    private lever: Lever;
    private walls;
    private ghost: Ghost;
    private doorTiles: Phaser.Types.Tilemaps.TiledObject[];
    private leverTiles: Phaser.Types.Tilemaps.TiledObject[];
    private doors: Door[] = [];
    private levers: Phaser.Physics.Arcade.StaticGroup[] = [];

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
        this.doorTiles = map.getObjectLayer('Door').objects;
        this.leverTiles = map.getObjectLayer('Lever').objects;

        // Display levers
        this.leverTiles.forEach(lever => {
            const l = new Lever(lever.x + lever.width / 2, lever.y - lever.height / 2, parseInt(lever.name), this);
            this.levers.push(this.physics.add.staticGroup(l));
        });

        // Display doors 
        this.doorTiles.forEach(door => {
            const d = new Door(door.x + door.width / 2, door.y - door.height / 2, parseInt(door.name), this);
            d.create();
            this.doors.push(d);
        });

        // Register the Player
        this.player = new Player(100, 200, this);
        this.player.create();

        // Register the Ghost
        this.ghost = new Ghost(200, 200, this/*, this.gameObjects*/);

        // Set wall layer as collinding layer
        map.setCollisionBetween(1, 999, true, true, this.walls);

        // Create collisions between Player and Walls
        this.physics.add.collider(this.player.player, this.walls);

        // Create collisions between Player and Doors
        let doorColliders: Phaser.Physics.Arcade.Collider[] = [];
        this.doors.forEach(door => {
            this.physics.add.staticGroup(door);
            doorColliders.push(this.physics.add.collider(this.player.player, door))
        })

        this.physics.add.collider(this.ghost.asset, this.walls);

        // Bind lever action to open linked door
        this.levers.forEach(e => {
            // Check if player is on a lever action's zone 
            this.physics.add.overlap(this.ghost.asset, e, () => this.ghost.objectAction((e.children.entries[0] as Lever)));
            // Register the event emited whene the ghost interact with a lever
            this.ghost.events.on('interact', (object) => {
                const lever = e.children.entries[0] as Lever;
                if (object === lever) {
                    lever.actionGhost();
                    // Get all linked doors
                    this.doors.filter(door => door.id === lever.id)
                        .forEach(linkedDoor => {
                            if (!linkedDoor.opened) {
                                // Open all the linked doors
                                linkedDoor.open();

                                // Remove the door collider
                                doorColliders = doorColliders.filter(dc => {
                                    if ((dc.object2 as Door).id === linkedDoor.id) {
                                        this.physics.world.removeCollider(dc)
                                    }
                                    return dc;
                                })
                                // After delay we close the door and reaply the collider.
                                this.time.delayedCall(10000, () => {
                                    linkedDoor.close();
                                    doorColliders.push(this.physics.add.collider(this.player.player, linkedDoor))
                                });
                            }
                        })
                }
            });
        })
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