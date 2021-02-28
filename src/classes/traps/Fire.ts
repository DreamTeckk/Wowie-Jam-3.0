import { Scene } from 'phaser';
import { CustomProperties } from '../../helpers/CustomProperties';
export default class Fire extends Phaser.GameObjects.Container {

    private _isActivated: boolean;
    private _objectSprite: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    private _activationTime: number;
    private fire: Phaser.GameObjects.Sprite;
    // N E W S
    private _activators: number[] = [];

    constructor(x: number, y: number, scene: Scene, properties: CustomProperties[]) {
        super(scene, x, y) // Registering the GameObject of the Player in the provided Scene with it's 2D position.

        this._isActivated = properties.filter(p => p.name === 'activated')[0].value as boolean;
        this._activators = (properties.filter(p => p.name === 'activators')[0].value as string).split('-').map(id => parseInt(id));
        this._activationTime = properties.filter(p => p.name === 'activationTime')[0].value as number;
    }

    get isActivated(): boolean {
        return this._isActivated;
    }

    set isActivated(value: boolean) {
        this._isActivated = value;
    }

    get objectSprite(): Phaser.Types.Physics.Arcade.SpriteWithDynamicBody {
        return this._objectSprite;
    }

    get activators(): number[] {
        return this._activators;
    }

    get activationTime(): number {
        return this._activationTime;
    }

    public create(): void {
        this._objectSprite = this.scene.physics.add.sprite(0, 0, 'firebase', 0);
        this.fire = this.scene.physics.add.sprite(0, 0, 'fire', 0);
        this.add(this._objectSprite);
        this.scene.add.existing(this);
        this.setSize(32, 32);
    }

    public update(): void {
        //
    }

    public changeState(): void {
        this._isActivated = !this._isActivated
        if (this._isActivated) {
            this.add(this.fire);
        }
        else {
            this.remove(this.fire);
        }
    }

}