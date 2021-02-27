import { GameObjects, Scene } from 'phaser';

export default class Lever extends Phaser.GameObjects.Container {

    private sprite: GameObjects.Rectangle;
    private _id: number;
    private _xPos: number;
    private _yPos: number;
    private _isActivated: boolean;
    private _activator: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;

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
        this._activator = this.scene.physics.add.sprite(this._xPos, this._yPos, 'activator');
        this.add(this._activator)
        this.setSize(32, 32);
        this.setInteractive();
        this.scene.add.existing(this);
    }

    public update(): void {
        // 
    }

    public actionGhost(): void {
        console.log(`Used activator n° ${this._id}`);
    }
}