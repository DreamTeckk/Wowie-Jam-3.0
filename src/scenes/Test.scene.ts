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
import Teleporter from '../classes/Teleporter';

export default class TestScene extends Scene {

    private player: Player;
    private lever: Lever;
    private spikes: Phaser.Physics.Arcade.StaticGroup[] = [];
    private walls;
    private teleporters: Phaser.Physics.Arcade.StaticGroup[] = [];
    private ghost: Ghost;
    private doors: Door[] = [];
    private fireballLauchers: FireballsLauncher[] = [];
    private levers: Phaser.Physics.Arcade.StaticGroup[] = [];
    private leversGhost: Phaser.Physics.Arcade.StaticGroup[] = [];
    private invincible = false;

    /** Object Layer */
    private spikeTiles: Phaser.Types.Tilemaps.TiledObject[];
    private tpTiles: Phaser.Types.Tilemaps.TiledObject[];
    private startTile: Phaser.Types.Tilemaps.TiledObject;
    private leverTiles: Phaser.Types.Tilemaps.TiledObject[];
    private leverGhostTiles: Phaser.Types.Tilemaps.TiledObject[];
    private doorTiles: Phaser.Types.Tilemaps.TiledObject[];
    private fireballLaucherTiles: Phaser.Types.Tilemaps.TiledObject[];
    private endTile: Phaser.Types.Tilemaps.TiledObject;

    /** Colliders */
    private doorColliders: Phaser.Physics.Arcade.Collider[] = []

    constructor() {
        super(config)

    }

    public preload(): void {
        //Load Tiles & TileMap
        this.load.image('tiles', 'assets/images/tileset.png');
        this.load.tilemapTiledJSON('testmap', 'assets/tilemaps/level-1.json');

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
        const tiles = map.addTilesetImage('TileSet', 'tiles');

        // Display Map Layers 
        map.createLayer('Ground', tiles);
        map.createLayer('Spikes', tiles);
        map.createLayer('Lava', tiles);
        this.walls = map.createLayer('Walls', tiles);
        this.doorTiles = map.getObjectLayer('Doors').objects;
        this.leverTiles = map.getObjectLayer('Levers').objects;
        this.leverGhostTiles = map.getObjectLayer('GhostLevers').objects;
        this.tpTiles = map.getObjectLayer('Teleporters').objects;
        this.startTile = map.getObjectLayer('Start').objects[0];
        this.endTile = map.getObjectLayer('End').objects[0];
        this.spikeTiles = map.getObjectLayer('SpikesObject').objects;
        this.fireballLaucherTiles = map.getObjectLayer('Launchers').objects;

        this.add.existing(this.add.rectangle(this.startTile.x, this.startTile.y, 32, 32, 0x555555));
        this.add.existing(this.add.rectangle(this.endTile.x, this.endTile.y, 32, 32, 0x750761));
        //this.add.existing()

        // Display teleporters
        this.tpTiles.forEach(tp => {
            const l = new Teleporter(tp.x + tp.width / 2, tp.y - tp.height / 2, parseInt(tp.name), this);
            this.teleporters.push(this.physics.add.staticGroup(l));
        });

        // Display levers
        this.leverTiles.forEach(lever => {
            const l = new Lever(lever.x + lever.width / 2, lever.y - lever.height / 2, parseInt(lever.name), this, false);
            l.create();
            this.levers.push(this.physics.add.staticGroup(l));
        });

        // Display ghost
        this.leverGhostTiles.forEach(lever => {
            const l = new Lever(lever.x + lever.width / 2, lever.y - lever.height / 2, parseInt(lever.name), this, true);
            l.create();
            this.leversGhost.push(this.physics.add.staticGroup(l));
        });

        // Display doors 
        this.doorTiles.forEach(door => {
            const d = new Door(door.x + door.width / 2, door.y - door.height / 2, door.name, this);
            d.create();
            this.doors.push(d);
        });

        // Dispaly spikes
        this.spikeTiles.forEach(spike => {
            const d = new Spike(spike.x + spike.width / 2, spike.y + spike.height / 2, spike.width, spike.height, parseInt(spike.name), this);
            d.create();
            this.spikes.push(this.physics.add.staticGroup(d));
        });

        map.setCollisionBetween(1, 999, true, true, this.walls);

        // Register the Player
        this.player = new Player(this.startTile.x, this.startTile.y, this);
        this.player.create();

        this.cameras.main.setZoom(1.2, 1.2);
        //this.cameras.main.setPosition(-this.player.x, -this.player.y);

        //this.cameras.main.setBounds(0, 0, 1024, 640);

        this.cameras.main.startFollow(this.player.player);
        this.cameras.main.followOffset.set(-this.player.x, -this.player.y);

        // Display lauchers 
        this.fireballLaucherTiles.forEach(fl => {
            const l = new FireballsLauncher(fl.x + fl.width / 2, fl.y - fl.height / 2, this, fl.name);
            l.create();
            this.physics.add.collider(l.fireballs, this.walls, (fireball) => fireball.destroy())
            this.physics.add.collider(this.player.player, l.fireballs, (player, fireball) => { this.death(); fireball.destroy() })
            this.fireballLauchers.push(l);
        });

        // Register the Ghost
        this.ghost = new Ghost(this.player.x, this.player.y, this);
        this.ghost.create();

        // Set wall layer as collinding layer
        map.setCollisionBetween(1, 999, true, true, this.walls);

        // Create collisions between Player and Walls
        this.physics.add.collider(this.player.player, this.walls);
        this.physics.add.collider(this.ghost.asset, this.walls);


        //Overlap spikes
        this.spikes.forEach(e => {
            this.physics.add.overlap(this.player.player, e, () => this.death());
        });

        // Create collisions between Player and Doors
        this.doors.forEach(door => {
            this.physics.add.staticGroup(door);
            this.doorColliders.push(this.physics.add.collider(this.player.player, door))
        });

        this.physics.add.collider(this.ghost.asset, this.walls);
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
                    console.log(lever.id);

                    // Activate the lever
                    lever.isActivated = true;
                    // Deactivate the lever after x milliseconds
                    this.time.delayedCall(lever.activationTime, () => lever.isActivated = false);
                    this.initDoorLogic(lever);
                    this.initFireBallLauncherLogic(lever);
                    this.revive();
                }
            });
        })

        this.teleporters.forEach(e => {
            // Check if player is on a teleporter action's zone 
            this.physics.add.overlap(this.ghost.asset, e, () => this.ghost.objectAction((e.children.entries[0] as Teleporter)));
            // Register the event emited whene the ghost interact with a teleporter
            this.ghost.events.on('interact', (object) => {
                const tp = e.children.entries[0] as Teleporter;
                if (object === tp) {
                    this.reviveTeleport();
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
        this.ghost.update();
    }

    private initDoorLogic(lever: Lever): void {
        this.doors.filter(door => door.activationPatern.includes(lever.id))
            .forEach(linkedDoor => {
                // Get all levers requires to open the door.
                const requiredLever = this.levers.filter(l => linkedDoor.activationPatern.includes((l.children.entries[0] as Lever).id));
                // Get the numbers of these levers that are activated
                const activatedLeversLength = requiredLever.filter(l => (l.children.entries[0] as Lever).isActivated).length;
                if (!linkedDoor.opened && requiredLever.length === activatedLeversLength) {
                    // Open all the linked doors
                    linkedDoor.open();

                    // Remove the door collider
                    this.doorColliders = this.doorColliders.filter(dc => {
                        if ((dc.object2 as Door).activationPatern === linkedDoor.activationPatern) {
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

    private initFireBallLauncherLogic(lever: Lever): void {
        this.fireballLauchers.filter(fl => fl.activationPatern.includes(lever.id.toString()))
            .forEach(linkedFl => {
                // Get all levers requires to switch the launcher.
                const requiredLever = this.levers.filter(l => linkedFl.activationPatern.includes((l.children.entries[0] as Lever).id.toString()));
                // Get the numbers of these levers that are activated
                const activatedLeversLength = requiredLever.filter(l => (l.children.entries[0] as Lever).isActivated).length;
                if (requiredLever.length === activatedLeversLength) {
                    // Activate all the launcher
                    linkedFl.isActivated = !linkedFl.isActivated;

                    // After delay we switch back the launchers
                    this.time.delayedCall(2000, () => {
                        linkedFl.isActivated = !linkedFl.isActivated;
                    });
                }
            })
    }

    public death(): void {
        if (!this.invincible) {
            this.invincible = true;
            this.time.delayedCall(3500, () => this.invincible = false, null, this);
            this.player.death();
            this.ghost.death(this.player.player.x, this.player.player.y);
            this.time.delayedCall(3000, () => this.revive(), null, this);
            this.cameras.main.stopFollow();
            this.cameras.main.startFollow(this.ghost.asset);
            this.cameras.main.followOffset.set(-this.player.x, -this.player.y)
        }
    }

    public revive(): void {
        this.player.revive();
        this.ghost.revive(this.player.player.x, this.player.player.y);
        this.cameras.main.stopFollow();
        this.cameras.main.startFollow(this.player.player);
        this.cameras.main.followOffset.set(-this.player.x, -this.player.y)
        this.invincible = true;
        this.time.delayedCall(1000, () => this.invincible = false, null, this);
    }

    public reviveTeleport(): void {
        this.ghost.reviveTeleport();
        this.player.reviveTeleport(this.ghost.asset.x, this.ghost.asset.y);
        this.cameras.main.stopFollow();
        this.cameras.main.startFollow(this.player.player);
        this.cameras.main.followOffset.set(-this.player.x, -this.player.y)
        this.invincible = true;
        this.time.delayedCall(1000, () => this.invincible = false, null, this);
    }
}