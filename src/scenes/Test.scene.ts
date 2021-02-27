const config: Phaser.Types.Scenes.SettingsConfig = {
    key: 'test', // The key to provide to Phaser whene you want to change scene to this one
    visible: false,
    active: false // Defines if the Scene is active or not.
}

import { Scene } from 'phaser';
import Activator from '../classes/Lever';
import Player from '../classes/Player';
import Spike from '../classes/Spike';


export default class TestScene extends Scene {

    private player;

    private spikeGroup;

    private spikeTiles: Phaser.Types.Tilemaps.TiledObject[];
    //private spikes: any[] = [];

    private walls;

    constructor() {
        super(config)
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
        this.walls = map.createLayer('Wall', tiles, 0, 0);
        map.createLayer('Door', tiles, 0, 0);

        this.spikeGroup = this.physics.add.group();
        this.spikeTiles = map.getObjectLayer('Spikes').objects;
        this.spikeTiles.forEach(spike => {
            const d = new Spike(spike.x + spike.width / 2, spike.y - spike.height / 2, parseInt(spike.name), this);
            d.create();
            this.spikeGroup.create(spike.x + spike.width / 2, spike.y - spike.height / 2, parseInt(spike.name), 'spike')
            //this.spikes.push(d);
        });

        map.setCollisionBetween(1, 999, true, true, this.walls);

        //Player
        this.player = new Player(100, 200, this);
        this.player.create();

        //Collision entre le joueur et un mur
        this.physics.add.collider(this.player._body, this.walls);

        //Detection d'un piege
        this.physics.add.overlap(this.player._body, this.spikeGroup, test, null, this);
    }

    /**
     * @param {number} time The current time. Either a High Resolution Timer value if it comes 
     * from Request Animation Frame, or Date.now if using SetTimeout.
     * @param {number} delta The delta time in ms since the last frame. 
     * This is a smoothed and capped value based on the FPS rate.
     */
    public update(time: number, delta: number): void {
        this.player.update();
    }
}

function test(player, spike) {
    console.log("ok");
    return false;
}