import { Scene } from 'phaser';

export default class Door extends Phaser.GameObjects.Container {

    private _sprite: Phaser.GameObjects.Rectangle;
    private _opened: boolean;
    private _activationPatern: number[];

    constructor(x: number, y: number, activationPatern: string, scene: Scene) {
        super(scene, x, y)
        this._activationPatern = activationPatern.split('-').map(id => parseInt(id));
        this._opened = false;
    }

    get opened(): boolean {
        return this._opened;
    }

    set opened(open: boolean) {
        this._opened = open;
    }

    get activationPatern(): number[] {
        return this._activationPatern;
    }

    get sprite(): Phaser.GameObjects.Rectangle {
        return this._sprite;
    }

    public create(): void {
        this._sprite = this.scene.add.rectangle(0, 0, 32, 32, 0xdede21).setOrigin(0.5, 0.5);
        this.add(this._sprite)
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
        this.sprite.setFillStyle(0xdede21);
    }
}
