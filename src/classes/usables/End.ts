import { GameObjects, Scene } from 'phaser';

export default class End extends Phaser.GameObjects.Container {

    private sprite: GameObjects.Rectangle;
    private _id: number;
    private _xPos: number;
    private _yPos: number;
    private objectSprite: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;


    constructor(x: number, y: number, scene: Scene) {
        super(scene, x, y)
        this._xPos = x;
        this._yPos = y;
    }


    public create(): void {
        //this.objectSprite = this.scene.physics.add.sprite(0, 0, 'activator');
        this.sprite = this.scene.add.rectangle(0, 0, 32, 32, 0x750761).setOrigin(0.5, 0.5);
        this.setSize(32, 32);
        this.setInteractive();
        this.scene.add.existing(this);
    }

    public update(): void {
        // 
    }
}