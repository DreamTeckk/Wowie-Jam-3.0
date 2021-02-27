import { GameObjects, Scene } from 'phaser';

export default class Teleporter extends Phaser.GameObjects.Container {

    private sprite: GameObjects.Rectangle;
    private _id: number;
    private _xPos: number;
    private _yPos: number;
    private _isActivated: boolean;
    private _teleporter: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;

    constructor(x: number, y: number, id: number, scene: Scene) {
        super(scene, x, y)
        this._id = id;
        this._isActivated = true;
        this._xPos = x;
        this._yPos = y;
    }

    get id(): number {
        return this._id;
    }

    set id(newId: number) {
        this._id = newId;
    }

    public create(): void {
        this._teleporter = this.scene.physics.add.sprite(this._xPos, this._yPos, 'teleporter');
        this.add(this._teleporter)
        this.setSize(32, 32);
        this.setInteractive();
        this.scene.add.existing(this);
    }

    public update(): void {
        // 
    }
}