import { Scene } from 'phaser';
export default class Fire extends Phaser.GameObjects.Container {

    private _isActivated: boolean;
    private _asset: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    private _fireSprite: Phaser.GameObjects.Rectangle;
    // N E W S
    private _activationPatern: string[];
    private _leverPatern: number[] = [];

    constructor(x: number, y: number, scene: Scene, objectName: string) {
        super(scene, x, y) // Registering the GameObject of the Player in the provided Scene with it's 2D position.

        this._activationPatern = objectName.split('-');
        this._asset = this.scene.physics.add.sprite(x, y, 'fireball_launcher')
        this._isActivated = this._activationPatern[this._activationPatern.length - 2] === 'T' ? true : false;
        this._leverPatern = this._activationPatern.slice(0, this._activationPatern.length - 2).map(v => parseInt(v));
    }

    get isActivated(): boolean {
        return this._isActivated;
    }

    set isActivated(value: boolean) {
        this._isActivated = value;
    }

    get asset(): Phaser.Types.Physics.Arcade.SpriteWithDynamicBody {
        return this._asset;
    }

    get activationPatern(): string[] {
        return this._activationPatern;
    }

    get leverPattern(): number[] {
        return this._leverPatern;
    }

    public create(): void {
        console.log(this._leverPatern);

        this._fireSprite = this.scene.add.rectangle(0, 0, 32, 32, 0xaa3333)
        this.add(this.scene.add.rectangle(0, 0, 32, 32, 0xFFaaaa));
        this.scene.add.existing(this);
        this.setSize(32, 32);
    }

    public update(): void {
        //
    }

    public changeState(): void {
        this._isActivated = !this._isActivated
        if (this._isActivated)
            this.add(this._fireSprite);
        else
            this.remove(this._fireSprite);
    }

}