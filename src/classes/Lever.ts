import { GameObjects, Scene } from 'phaser';

export default class Lever extends Phaser.GameObjects.Container {

    private sprite: GameObjects.Rectangle;
    private _id: number;
    private _events: Phaser.Events.EventEmitter = new Phaser.Events.EventEmitter();

    constructor(x: number, y: number, id: number, scene: Scene) {
        super(scene, x, y)
        this._id = id;
    }

    get event(): Phaser.Events.EventEmitter {
        return this._events;
    }

    get id(): number {
        return this._id;
    }

    set id(newId: number) {
        this._id = newId;
    }

    public create(): void {
        this.sprite = this.scene.add.rectangle(0, 0, 32, 32, 0xaa00aa).setOrigin(0.5, 0.5);
        this.add(this.sprite)
        this.setSize(32, 32);
        this.setInteractive();
        this.scene.add.existing(this);
        this.on(Phaser.Input.Events.POINTER_DOWN, () => {
            this._events.emit('activate');
        });
    }

    public update(): void {
        // 
    }

}