import { GameObjects, Scene } from 'phaser';

export default class End extends Phaser.GameObjects.Container {

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
        this.objectSprite = this.scene.physics.add.sprite(0, 0, 'end_stone', 0);
        this.add(this.objectSprite);
        this.setSize(32, 32);
        this.setInteractive();
        this.scene.add.existing(this);
    }

    public update(): void {
        // 
    }
}