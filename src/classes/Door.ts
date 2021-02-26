import { GameObjects, Scene } from 'phaser';

export default class Door extends Phaser.GameObjects.Container {

    private sprite: GameObjects.Rectangle;
    private _opened: boolean;
    private _id: number;

    constructor(x: number, y: number, id: number, scene: Scene) {
        super(scene, x, y)
        this._id = id;
        this._opened = false;
    }

    get opened(): boolean {
        return this._opened;
    }

    set opened(open: boolean) {
        this._opened = open;
    }

    get id(): number {
        return this._id;
    }

    set id(newId: number) {
        this._id = newId;
    }

    public create(): void {
        this.sprite = this.scene.add.rectangle(0, 0, 32, 32, 0xFF0000).setOrigin(0.5, 0.5);
        this.add(this.sprite)
        this.setSize(32, 32);
        this.setInteractive();
        this.scene.add.existing(this);
    }

    public update(): void {
        // 
    }

    public open(): void {
        this._opened = true;
        this.sprite.setFillStyle(0x00ff00);
    }

    public close(): void {
        this._opened = false;
        this.sprite.setFillStyle(0xff0000);
    }
}
