import Ghost from '../classes/Ghost';
import Player from '../classes/Player';
import Fire from '../classes/traps/Fire';
import FireballsLauncher from '../classes/traps/FireballsLauncher';
import Spike from '../classes/traps/Spike';
import Door from '../classes/usables/Door';
import End from '../classes/usables/End';
import Lever from '../classes/usables/Lever';
import Teleporter from '../classes/usables/Teleporter';

export default class SceneFactory {

    private scene: Phaser.Scene;


    private idLevel: number

    private player: Player;
    private leverList: Lever[] = [];
    private spikes: Phaser.Physics.Arcade.StaticGroup[] = [];
    private walls: Phaser.Tilemaps.TilemapLayer;
    private teleporters: Phaser.Physics.Arcade.StaticGroup[] = [];
    private ghost: Ghost;
    private doors: Door[] = [];
    private fireballLauchers: FireballsLauncher[] = [];
    private fires: Fire[] = [];
    private levers: Phaser.Physics.Arcade.StaticGroup[] = [];
    private leversGhost: Phaser.Physics.Arcade.StaticGroup[] = [];
    private pressurePlates: Phaser.Physics.Arcade.StaticGroup[] = [];
    private invincible = false;
    private musicButton: Phaser.GameObjects.Sprite;
    private revived = false;
    private levelUpSound: Phaser.Sound.BaseSound;

    /** Object Layer */
    private spikeTiles: Phaser.Types.Tilemaps.TiledObject[];
    private tpTiles: Phaser.Types.Tilemaps.TiledObject[];
    private startTile: Phaser.Types.Tilemaps.TiledObject;
    private leverTiles: Phaser.Types.Tilemaps.TiledObject[];
    private leverGhostTiles: Phaser.Types.Tilemaps.TiledObject[];
    private doorTiles: Phaser.Types.Tilemaps.TiledObject[];
    private fireballLaucherTiles: Phaser.Types.Tilemaps.TiledObject[];
    private endTile: Phaser.Types.Tilemaps.TiledObject;
    private fireTiles: Phaser.Types.Tilemaps.TiledObject[];
    private pressurePlateTiles: Phaser.Types.Tilemaps.TiledObject[];

    /** Colliders */
    private doorColliders: Phaser.Physics.Arcade.Collider[] = []

    /* Music */
    private music: Phaser.Sound.BaseSound;


    constructor(scene: Phaser.Scene) {
        this.scene = scene;
    }

    public prelaod(): void {
        //Load Tiles & TileMap
        this.idLevel = this.scene.game.registry.get('idLevel')

        this.scene.load.image('tiles', 'assets/images/tileset/tileset.png');
        this.scene.load.tilemapTiledJSON(`level${this.idLevel}`, `assets/tilemaps/level-${this.idLevel}.json`);

        /** Load SpriteSheets */
        this.scene.load.spritesheet('lever', 'assets/images/objects/lever_spritesheet.png', { frameWidth: 32, frameHeight: 32, endFrame: 1 })
        this.scene.load.spritesheet('lever_ghost', 'assets/images/objects/ghost_lever_spritesheet.png', { frameWidth: 32, frameHeight: 32, endFrame: 1 })
        this.scene.load.spritesheet('pressure_plate', 'assets/images/objects/pressure_plate_spritesheet.png', { frameWidth: 32, frameHeight: 32, endFrame: 1 })
        this.scene.load.spritesheet('start_stone', 'assets/images/objects/start.png', { frameWidth: 32, frameHeight: 32, endFrame: 1 })
        this.scene.load.spritesheet('end_stone', 'assets/images/objects/end.png', { frameWidth: 32, frameHeight: 32, endFrame: 1 })
        this.scene.load.spritesheet('firebase', 'assets/images/objects/firebase.png', { frameWidth: 32, frameHeight: 32, endFrame: 1 })
        this.scene.load.spritesheet('fire', 'assets/images/objects/fire_spritesheet.png', { frameWidth: 32, frameHeight: 32, endFrame: 7 })
        this.scene.load.spritesheet('fireball', 'assets/images/objects/fireball_spritesheet.png', { frameWidth: 32, frameHeight: 32, endFrame: 7 })
        this.scene.load.spritesheet('door_face', 'assets/images/objects/door_face_spritesheet.png', { frameWidth: 64, frameHeight: 64, endFrame: 8 })
        this.scene.load.spritesheet('door_side', 'assets/images/objects/door_side_spritesheet.png', { frameWidth: 32, frameHeight: 64, endFrame: 5 })
        this.scene.load.spritesheet('ghost', 'assets/images/player/ghost_spritesheet.png', { frameWidth: 32, frameHeight: 32, endFrame: 7 })
        this.scene.load.spritesheet('player', 'assets/images/player/player_spritesheet.png', { frameWidth: 32, frameHeight: 32, endFrame: 33 })
        this.scene.load.spritesheet('teleporter', 'assets/images/objects/teleporter_spritesheet.png', { frameWidth: 32, frameHeight: 32, endFrame: 6 })


        this.scene.load.spritesheet('musicButton', 'assets/spritesheets/musicButton.png', { frameWidth: 64, frameHeight: 64, endFrame: 1 })

        this.scene.load.spritesheet('player', 'assets/spritesheets/spritesheet.png', { frameWidth: 32, frameHeight: 32 });
        // scene.Load Activator sprite
        this.scene.load.spritesheet('activator', 'assets/spritesheets/activator.png', { frameWidth: 32, frameHeight: 32 });

        // scene.Load Sounds
        this.scene.load.audio('leverOpen', 'assets/sounds/objects/leverOpen.wav');
        this.scene.load.audio('leverClose', 'assets/sounds/objects/leverClose.wav');
        this.scene.load.audio('door', 'assets/sounds/objects/door.wav');
        this.scene.load.audio('fire', 'assets/sounds/objects/fire.mp3');
        this.scene.load.audio('fireball', 'assets/sounds/objects/fireball.wav');
        this.scene.load.audio('fireballLauncher', 'assets/sounds/objects/fireballLauncher.wav');
        this.scene.load.audio('teleportation', 'assets/sounds/objects/teleportation.wav');
        this.scene.load.audio('door', 'assets/sounds/objects/door.wav');
        this.scene.load.audio('death', 'assets/sounds/death.wav');
        this.scene.load.audio('revive', 'assets/sounds/revive.mp3');
        this.scene.load.audio('levelup', 'assets/sounds/level-up.wav');
    }

    public create(): void {

        this.levelUpSound = this.scene.sound.add('levelup', { volume: 0.2 });
        // Create the TileMap
        const map = this.scene.make.tilemap({ key: `level${this.idLevel}` })
        const tiles = map.addTilesetImage('TileSet', 'tiles');

        // Display Map Layers 
        map.createLayer('Underground', tiles);
        map.createLayer('Ground', tiles);
        map.createLayer('Spikes', tiles);
        this.walls = map.createLayer('Walls', tiles);
        map.createLayer('Props', tiles);
        map.createLayer('Launchers', tiles);
        this.doorTiles = map.getObjectLayer('Doors') ? map.getObjectLayer('Doors').objects : [];
        this.leverTiles = map.getObjectLayer('Levers') ? map.getObjectLayer('Levers').objects : [];
        this.leverGhostTiles = map.getObjectLayer('GhostLevers') ? map.getObjectLayer('GhostLevers').objects : [];
        this.pressurePlateTiles = map.getObjectLayer('PressurePlates') ? map.getObjectLayer('PressurePlates').objects : [];
        this.tpTiles = map.getObjectLayer('Teleporters') ? map.getObjectLayer('Teleporters').objects : [];
        this.startTile = map.getObjectLayer('Start') ? map.getObjectLayer('Start').objects[0] : null;
        this.endTile = map.getObjectLayer('End').objects ? map.getObjectLayer('End').objects[0] : null;
        this.spikeTiles = map.getObjectLayer('SpikesObject') ? map.getObjectLayer('SpikesObject').objects : [];
        this.fireballLaucherTiles = map.getObjectLayer('LaunchersObject') ? map.getObjectLayer('LaunchersObject').objects : [];
        this.fireTiles = map.getObjectLayer('Fires') ? map.getObjectLayer('Fires').objects : [];

        this.scene.add.existing(this.scene.add.sprite(this.startTile.x + this.startTile.width / 2, this.startTile.y - this.startTile.height / 2, 'start_stone', 0));
        //this.scene.add.existing(this.scene.add.rectangle(this.endTile.x, this.endTile.y, 32, 32, 0x750761));
        //this.scene.add.existing()

        //Display the end
        const end = new End(this.endTile.x + this.endTile.width / 2, this.endTile.y - this.endTile.height / 2, this.scene);
        end.create();
        this.scene.physics.add.staticGroup(end);

        // Display teleporters
        this.tpTiles.forEach(tp => {
            const l = new Teleporter(tp.x + tp.width / 2, tp.y - tp.height / 2, this.scene);
            l.create();
            this.teleporters.push(this.scene.physics.add.staticGroup(l));
        });

        // Display levers
        this.leverTiles.forEach(lever => {
            const l = new Lever(lever.x + lever.width / 2, lever.y - lever.height / 2, this.scene, false, lever.properties);
            l.create();
            this.levers.push(this.scene.physics.add.staticGroup(l));
            this.leverList.push(l);
        });

        // Display ghost
        this.leverGhostTiles.forEach(lever => {
            const l = new Lever(lever.x + lever.width / 2, lever.y - lever.height / 2, this.scene, true, lever.properties);
            l.create();
            this.leversGhost.push(this.scene.physics.add.staticGroup(l).setVisible(false));
        });

        // Display doors 
        this.doorTiles.forEach(door => {
            const d = new Door(door.x + door.width / 2, door.y - door.height / 2, this.scene, door.properties, door.width === 64);
            d.create();
            this.doors.push(d);
        });

        // Dispaly spikes
        this.spikeTiles.forEach(spike => {
            const d = new Spike(spike.x + spike.width / 2, spike.y + spike.height / 2, spike.width, spike.height, parseInt(spike.name), this.scene);
            d.create();
            this.spikes.push(this.scene.physics.add.staticGroup(d));
        });


        //Display pressure plate 
        this.pressurePlateTiles.forEach(lever => {
            const l = new Lever(lever.x + lever.width / 2, lever.y - lever.height / 2, this.scene, null, lever.properties);
            l.create();
            this.pressurePlates.push(this.scene.physics.add.staticGroup(l));
        });

        //Display tp 

        //const l2 = new Teleporter(800, 500, this);
        //this.teleporters.push(this.scene.physics.add.staticGroup(l2));
        //map.setCollisionBetween(1, 999, true, true, this.walls);

        // Register the Player
        this.player = new Player(this.startTile.x + this.startTile.width / 2 + 5, this.startTile.y - this.startTile.height / 2 - 15, this.scene);
        this.player.create();

        this.scene.cameras.main.setZoom(1.2, 1.2);
        //this.scene.cameras.main.setPosition(-this.player.x, -this.player.y);

        //this.scene.cameras.main.setBounds(0, 0, 1024, 640);

        this.scene.cameras.main.startFollow(this.player.objectSprite);
        this.scene.cameras.main.followOffset.set(-this.player.x, -this.player.y);

        // Display lauchers 
        this.fireballLaucherTiles.forEach(fl => {
            const l = new FireballsLauncher(fl.x + fl.width / 2, fl.y - fl.height / 2, this.scene, fl.properties);
            l.create();
            this.scene.physics.add.staticGroup(l)
            this.scene.physics.add.collider(l, this.player.objectSprite)
            this.scene.physics.add.collider(l.fireballs, this.walls, (fireball) => fireball.destroy())
            this.scene.physics.add.overlap(this.player.objectSprite, l.fireballs, (player, fireball) => { this.death(); fireball.destroy() })
            this.fireballLauchers.push(l);
        });

        // Display fires 
        this.fireTiles.forEach(ft => {
            const f = new Fire(ft.x + ft.width / 2, ft.y - ft.height / 2, this.scene, ft.properties);
            f.create();
            this.scene.physics.add.staticGroup(f)
            this.scene.physics.add.overlap(f, this.player.objectSprite, () => {
                if (f.isActivated)
                    this.death();
            })
            this.fires.push(f);
        });

        this.player.draw();

        // Register the Ghost
        this.ghost = new Ghost(this.player.x, this.player.y, this.scene);
        this.ghost.create();

        // Set wall layer as collinding layer
        map.setCollisionBetween(1, 999, true, true, this.walls);

        // Create collisions between Player and Walls
        this.scene.physics.add.collider(this.player.objectSprite, this.walls);
        this.scene.physics.add.collider(this.ghost.asset, this.walls);


        //Overlap spikes
        this.spikes.forEach(e => {
            this.scene.physics.add.overlap(this.player.objectSprite, e, () => this.death());
        });

        //Overlap end
        this.scene.physics.add.overlap(this.player.objectSprite, end, () => this.nextMap());

        // Create collisions between Player and Doors
        this.doors.forEach(door => {
            this.scene.physics.add.staticGroup(door);
            this.doorColliders.push(this.scene.physics.add.collider(this.player.objectSprite, door))
        });

        this.scene.physics.add.collider(this.ghost.asset, this.walls);

        // Bind lever action to open linked door
        this.leversGhost.forEach(e => {
            // Check if player is on a lever action's zone 
            this.scene.physics.add.overlap(this.ghost.asset, e, () => this.ghost.objectAction((e.children.entries[0] as Lever)));
            // Register the event emited whene the ghost interact with a lever
            this.ghost.events.on('interact', (object) => {
                const lever = e.children.entries[0] as Lever;
                if (object === lever) {
                    if (!lever.isActivated) {
                        //Activate lever
                        lever.changeState();
                        lever.desactivators.forEach(des => {
                            this.leverList.filter(lev => lev.id == des && lev.isActivated)
                                .forEach(lev => {
                                    lev.changeState();
                                    lever.changeState();
                                    this.desactivateIndicators(lev);
                                })
                        });
                        //Play lever music
                        lever.playOpen()
                        // Deactivate the lever after x milliseconds
                        if (lever.activationTime != 0)
                            this.scene.time.delayedCall(lever.activationTime, () => {
                                this.desactivateIndicators(lever);
                                lever.changeState()
                            });
                        this.initDoorLogic(lever);
                        this.initFireBallLauncherLogic(lever);
                        this.initFireLogic(lever);
                        this.revive();
                        this.revived = true;
                    }
                }
            });
        })

        this.levers.forEach(e => {
            this.scene.physics.add.overlap(this.player.objectSprite, e, () => {
                this.player.objectAction(e.children.entries[0] as Lever)
            });
            this.player.events.on('interact', (object) => {
                const lever = e.children.entries[0] as Lever;
                if (object === lever) {
                    if (!lever.isActivated) {
                        // Activate the lever
                        lever.changeState();
                        lever.desactivators.forEach(des => {
                            this.leverList.filter(lev => lev.id == des && lev.isActivated)
                                .forEach(lev => {
                                    lev.changeState();
                                    lever.changeState();
                                    this.desactivateIndicators(lev);
                                })
                        });
                        // Deactivate the lever after x milliseconds
                        if (lever.activationTime != 0)
                            this.scene.time.delayedCall(lever.activationTime, () => {
                                this.desactivateIndicators(lever);
                                lever.changeState()
                            });
                        this.initDoorLogic(lever);
                        this.initFireBallLauncherLogic(lever)
                        this.initFireLogic(lever);
                    } else if (lever.activationTime == 0) {
                        lever.changeState();
                    }
                }
            })
        })

        this.teleporters.forEach(e => {
            // Check if player is on a teleporter action's zone 
            this.scene.physics.add.overlap(this.ghost.asset, e, () => this.ghost.objectAction((e.children.entries[0] as Teleporter)));
            // Register the event emited whene the ghost interact with a teleporter
            this.ghost.events.on('interact', (object) => {
                const tp = e.children.entries[0] as Teleporter;
                if (object === tp) {
                    tp.animate();
                    this.reviveTeleport();
                }
            });
        })

        this.pressurePlates.forEach(e => {
            this.scene.physics.add.overlap(this.player.objectSprite, e, (player, e) => {
                const lever = e as Lever
                if (!lever.isActivated) {
                    // Activate the lever
                    lever.changeState();
                    // Deactivate the lever after x milliseconds
                    if (lever.activationTime != 0)
                        this.scene.time.delayedCall(lever.activationTime, () => {
                            this.desactivateIndicators(lever);
                            lever.changeState()
                        });
                    this.initDoorLogic(lever);
                    this.initFireBallLauncherLogic(lever);
                    this.initFireLogic(lever);
                } else if (lever.activationTime == 0) {
                    lever.changeState();
                }
            })
        })

        //SOUND AFFECTATION
        this.music = (this.scene.registry.get('themeMusic') as Phaser.Sound.BaseSound);

        //Create the music button
        this.musicButton = this.scene.add.sprite(1090, 75, 'musicButton').setOrigin(1, 0).setInteractive().setScrollFactor(0)
        this.musicButton.on('pointerdown', () => {
            if (this.music.isPaused) {
                this.music.play();
                this.musicButton.setFrame(0);
            } else {
                this.music.pause();
                this.musicButton.setFrame(1);
            }
        }, this);

        this.scene.add.existing(this.musicButton);
    }

    public update(): void {
        this.player.update();
        this.ghost.update();
    }

    private initDoorLogic(lever: Lever): void {
        this.doors.filter(door => door.activators.includes(lever.id))
            .forEach(linkedDoor => {
                // Get all levers requires to open the door.
                const requiredLever = [
                    ...this.levers.filter(l => linkedDoor.activators.includes((l.children.entries[0] as Lever).id)),
                    ...this.leversGhost.filter(l => linkedDoor.activators.includes((l.children.entries[0] as Lever).id)),
                    ...this.pressurePlates.filter(l => linkedDoor.activators.includes((l.children.entries[0] as Lever).id))

                ]
                // Get the numbers of these levers that are activated
                const activatedLeversLength = requiredLever.filter(l => (l.children.entries[0] as Lever).isActivated).length;
                linkedDoor.activateIndicator(activatedLeversLength);
                if (!linkedDoor.opened && requiredLever.length === activatedLeversLength) {
                    // Open all the linked doors
                    linkedDoor.open();

                    // Remove the door collider
                    this.doorColliders = this.doorColliders.filter(dc => {
                        if ((dc.object2 as Door).activators === linkedDoor.activators) {
                            this.scene.physics.world.removeCollider(dc)
                        }
                        return dc;
                    })
                    // After delay we close the door and reaply the collider.
                    this.scene.time.delayedCall(linkedDoor.activationTime, () => {
                        linkedDoor.close();
                        this.doorColliders.push(this.scene.physics.add.collider(this.player.objectSprite, linkedDoor))
                    });
                }
            })
    }

    private initFireBallLauncherLogic(lever: Lever): void {
        this.fireballLauchers.filter(fl => fl.activators.includes(lever.id))
            .forEach(linkedFl => {
                // Get all levers requires to switch the launcher.
                const requiredLever = [
                    ...this.levers.filter(l => linkedFl.activators.includes((l.children.entries[0] as Lever).id)),
                    ...this.leversGhost.filter(l => linkedFl.activators.includes((l.children.entries[0] as Lever).id)),
                    ...this.pressurePlates.filter(l => linkedFl.activators.includes((l.children.entries[0] as Lever).id))
                ];
                // Get the numbers of these levers that are activated
                const activatedLeversLength = requiredLever.filter(l => (l.children.entries[0] as Lever).isActivated).length;
                linkedFl.activateIndicator(activatedLeversLength);
                if (requiredLever.length === activatedLeversLength) {
                    // Activate all the launcher
                    linkedFl.changeState();

                    // After delay we switch back the launchers
                    this.scene.time.delayedCall(linkedFl.activationTime, () => {
                        linkedFl.changeState();
                    });
                }
            })
    }

    private initFireLogic(lever: Lever): void {
        this.fires.filter(fire => fire.activators.includes(lever.id))
            .forEach(linkedFires => {
                // Get all levers requires to switch the launcher.
                const requiredLever = [
                    ...this.levers.filter(l => linkedFires.activators.includes((l.children.entries[0] as Lever).id)),
                    ...this.leversGhost.filter(l => linkedFires.activators.includes((l.children.entries[0] as Lever).id)),
                    ...this.pressurePlates.filter(l => linkedFires.activators.includes((l.children.entries[0] as Lever).id))
                ];
                // Get the numbers of these levers that are activated
                const activatedLeversLength = requiredLever.filter(l => (l.children.entries[0] as Lever).isActivated).length;
                linkedFires.activateIndicator(activatedLeversLength);
                if (requiredLever.length === activatedLeversLength) {
                    // Activate all the launcher
                    linkedFires.changeState();

                    // After delay we switch back the launchers
                    this.scene.time.delayedCall(linkedFires.activationTime, () => {
                        linkedFires.changeState();
                    });
                }
            })
    }

    private desactivateIndicators(lever): void {
        this.doors.filter(door => door.activators.includes(lever.id)).forEach(door => door.desactivateIndicator());
        this.fires.filter(fire => fire.activators.includes(lever.id)).forEach(fire => fire.desactivateIndicator());
        this.fireballLauchers.filter(fl => fl.activators.includes(lever.id)).forEach(fl => fl.desactivateIndicator());
    }

    public death(): void {
        if (!this.invincible) {
            this.invincible = true;
            this.scene.time.delayedCall(3500, () => this.invincible = false, null, this);
            this.player.death();
            this.ghost.death(this.player.objectSprite.x, this.player.objectSprite.y);
            this.leversGhost.forEach(element => element.setVisible(true));
            this.scene.time.delayedCall(3000, () => this.revive(), null, this);
            this.scene.cameras.main.stopFollow();
            this.scene.cameras.main.startFollow(this.ghost.asset);
            this.scene.cameras.main.followOffset.set(-this.player.x, -this.player.y)
        }
    }

    public revive(): void {
        if (!this.revived && !this.player.objectSprite.anims.isPlaying) {
            this.player.revive();
            this.ghost.revive(this.player.objectSprite.x, this.player.objectSprite.y);
            this.scene.cameras.main.stopFollow();
            this.scene.cameras.main.startFollow(this.player.objectSprite);
            this.scene.cameras.main.followOffset.set(-this.player.x, -this.player.y)
            this.leversGhost.forEach(element => element.setVisible(false));
            this.invincible = true;
            this.scene.time.delayedCall(500, () => this.invincible = false, null, this);
        } else {
            this.revived = false;
        }
    }

    public reviveTeleport(): void {
        this.ghost.reviveTeleport();
        this.player.reviveTeleport(this.ghost.asset.x, this.ghost.asset.y);
        this.scene.cameras.main.stopFollow();
        this.scene.cameras.main.startFollow(this.player.objectSprite);
        this.scene.cameras.main.followOffset.set(-this.player.x, -this.player.y)
        this.invincible = true;
        this.scene.time.delayedCall(500, () => this.invincible = false, null, this);
    }

    public nextMap(): void {
        this.scene.game.registry.inc('idLevel', 1)
        console.log(`level-${this.scene.registry.get('idLevel')}`);
        this.levelUpSound.play();
        this.scene.scene.start(`level-${this.scene.registry.get('idLevel')}`);
    }
}