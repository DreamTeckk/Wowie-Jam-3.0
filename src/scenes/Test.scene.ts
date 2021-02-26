const config: Phaser.Types.Scenes.SettingsConfig = {
    key: 'test', // The key to provide to Phaser whene you want to change scene to this one
    visible: false,
    active: false // Defines if the Scene is active or not.
}

import { Scene } from 'phaser';
import Door from '../classes/Door';
import Lever from '../classes/Lever';


export default class TestScene extends Scene {

    private doorTiles: Phaser.Types.Tilemaps.TiledObject[];
    private leverTiles: Phaser.Types.Tilemaps.TiledObject[];
    private doors: Door[] = [];
    private levers: Lever[] = [];

    constructor() {
        super(config)

    }

    public preload(): void {
        this.load.image('tiles', 'assets/images/tileset.png');
        this.load.tilemapTiledJSON('testmap', 'assets/tilemaps/test-map.json');
    }

    public create(): void {
        const map = this.make.tilemap({ key: 'testmap' })
        const tiles = map.addTilesetImage('tileset_test', 'tiles');

        map.createLayer('Ground', tiles, 0, 0);
        map.createLayer('Wall', tiles, 0, 0);
        this.doorTiles = map.getObjectLayer('Door').objects;
        this.leverTiles = map.getObjectLayer('Lever').objects;
        this.leverTiles.forEach(lever => {
            const l = new Lever(lever.x + lever.width / 2, lever.y - lever.height / 2, parseInt(lever.name), this);
            l.create();
            this.levers.push(l);
        });
        this.doorTiles.forEach(door => {
            const d = new Door(door.x + door.width / 2, door.y - door.height / 2, parseInt(door.name), this);
            d.create();
            this.levers.filter(l => l.id === d.id)[0].event.on('activate', () => !d.opened ? d.open() : null)
            this.doors.push(d);
        })
    }
    /**
     * @param {number} time The current time. Either a High Resolution Timer value if it comes 
     * from Request Animation Frame, or Date.now if using SetTimeout.
     * @param {number} delta The delta time in ms since the last frame. 
     * This is a smoothed and capped value based on the FPS rate.
     */
    public update(time: number, delta: number): void {
        //
    }
}