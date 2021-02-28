import { Scene } from 'phaser';
import { CustomProperties } from '../../helpers/CustomProperties';

export default class Door extends Phaser.GameObjects.Container {

    private _sprite: Phaser.GameObjects.Rectangle;
    private _opened: boolean;
    private _activators: number[];
    private _activationTime: number;
    private _sound: Phaser.Sound.BaseSound

    constructor(x: number, y: number, scene: Scene, properties: CustomProperties[]) {
        super(scene, x, y)
        this._activators = (properties.filter(p => p.name === 'activators')[0].value as string).split('-').map(id => parseInt(id));
        this._activationTime = properties.filter(p => p.name === 'activationTime')[0].value as number;
        this._opened = false;
    }

    get opened(): boolean {
        return this._opened;
    }

    set opened(open: boolean) {
        this._opened = open;
    }

    get activators(): number[] {
        return this._activators;
    }

    get activationTime(): number {
        return this._activationTime;
    }

    get sprite(): Phaser.GameObjects.Rectangle {
        return this._sprite;
    }

    public create(): void {
        this._sound = this.scene.sound.add('door')
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
        this._sound.play()
        this._opened = true;
        this.sprite.setFillStyle(0x00ff00);
    }

    public close(): void {
        this._opened = false;
        this.sprite.setFillStyle(0xdede21);
    }
}
