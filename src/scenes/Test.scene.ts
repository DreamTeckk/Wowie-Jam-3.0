const config: Phaser.Types.Scenes.SettingsConfig = {
    key: 'test', // The key to provide to Phaser whene you want to change scene to this one
    visible: false,
    active: false // Defines if the Scene is active or not.
}

import { Scene } from 'phaser';
import Lever from '../classes/Lever';
import Player from '../classes/Player';
import Spike from '../classes/Spike'
import Ghost from '../classes/Ghost'
import Door from '../classes/Door';
import FireballsLauncher from '../classes/FireballsLauncher'
import { Direction } from '../enums/direction';

export default class TestScene extends Scene {

    private player: Player;
    private lever: Lever;
    private spikes: Phaser.Physics.Arcade.StaticGroup[] = [];
    private spikeTiles: Phaser.Types.Tilemaps.TiledObject[];
    private walls;
    private fireballLauncher: FireballsLauncher;
    private ghost: Ghost;
    private doorTiles: Phaser.Types.Tilemaps.TiledObject[];
    private leverTiles: Phaser.Types.Tilemaps.TiledObject[];
    private doors: Door[] = [];
    private levers: Phaser.Physics.Arcade.StaticGroup[] = [];

    /** Colliders */
    private doorColliders: Phaser.Physics.Arcade.Collider[] = []

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

        map.setCollisionBetween(1, 999, true, true, this.walls);

        // Register the Player
        this.player = new Player(100, 200, this);
        this.player.create();

        //this.cameras.main.setZoom(1,2);
        //this.cameras.main.setPosition(-this.player.x, -this.player.y);

        //this.cameras.main.setBounds(0, 0, 1024, 640);

        this.cameras.main.startFollow(this.player.player);
        this.cameras.main.followOffset.set(-this.player.x, -this.player.y);


        // Register the Ghost
        this.ghost = new Ghost(100, 200, this);
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
        //Lever
        //this.lever = new Activator(400, 400, this);
        //this.lever.create();

        console.log(this.spikes)

        this.spikes.forEach(e => {
            this.physics.add.overlap(this.player.player, e, () => this.death());
        });

        // Create collisions between Player and Doors
        this.doors.forEach(door => {
            this.physics.add.staticGroup(door);
            this.doorColliders.push(this.physics.add.collider(this.player.player, door))
        })

        this.physics.add.collider(this.ghost.asset, this.walls);
        this.fireballLauncher = new FireballsLauncher(250, 150, this, this.walls, Direction.EAST)
        this.fireballLauncher.create()
        this.physics.add.collider(this.fireballLauncher.fireballs, this.walls, (fireball) => fireball.destroy())
        this.physics.add.collider(this.player.player, this.fireballLauncher.fireballs, (player, fireball) => { this.death(); fireball.destroy() })
        this.ghost.events.on('interact', (object) => {
            //
        })

        // Bind lever action to open linked door
        this.levers.forEach(e => {
            // Check if player is on a lever action's zone 
            this.physics.add.overlap(this.ghost.asset, e, () => this.ghost.objectAction((e.children.entries[0] as Lever)));
            // Register the event emited whene the ghost interact with a lever
            this.ghost.events.on('interact', (object) => {
                const lever = e.children.entries[0] as Lever;
                if (object === lever) {
                    lever.actionGhost();
                    this.initDoorLogic(lever);
                    this.revive();
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

    private initDoorLogic(lever: Lever): void {
        this.doors.filter(door => door.id === lever.id)
            .forEach(linkedDoor => {
                if (!linkedDoor.opened) {
                    // Open all the linked doors
                    linkedDoor.open();

                    // Remove the door collider
                    this.doorColliders = this.doorColliders.filter(dc => {
                        if ((dc.object2 as Door).id === linkedDoor.id) {
                            this.physics.world.removeCollider(dc)
                        }
                        return dc;
                    })
                    // After delay we close the door and reaply the collider.
                    this.time.delayedCall(10000, () => {
                        linkedDoor.close();
                        this.doorColliders.push(this.physics.add.collider(this.player.player, linkedDoor))
                    });
                }
            })
    }
    public death(): void {
        this.player.death();
        this.ghost.death(this.player.player.x, this.player.player.y);
        this.time.delayedCall(3000, () => this.revive(), null, this);
        this.cameras.main.stopFollow();
        this.cameras.main.startFollow(this.ghost.asset);
        this.cameras.main.followOffset.set(-this.player.x, -this.player.y)
    }

    public revive(): void {
        this.player.revive();
        this.ghost.revive(this.player.player.x, this.player.player.y);
    }
}