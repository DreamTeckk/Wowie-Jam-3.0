import { GameObjects, Scene } from 'phaser';

export default class Teleporter extends Phaser.GameObjects.Container {

    private sprite: GameObjects.Rectangle;
    private _xPos: number;
    private _yPos: number;
    private _isActivated: boolean;
    private _teleporter: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;

    constructor(x: number, y: number, scene: Scene) {
        super(scene, x, y)
        this._isActivated = true;
        this._xPos = x;
        this._yPos = y;
    }

    public create(): void {
        this._teleporter = this.scene.physics.add.sprite(0, 0, 'teleporter');
        this.add(this._teleporter)
        this.registerAnimations();
        this.setSize(32, 32);
        this.setInteractive();
        this.scene.add.existing(this);
    }

    public update(): void {
        // 
    }

    public animate(): void {
        this._teleporter.anims.play('teleport').on('animationcomplete', () => {
            this._teleporter.setFrame(0);
        });
    }

    public registerAnimations(): void {
        const teleport: Phaser.Types.Animations.Animation = {
            key: 'teleport',
            frames: this.scene.anims.generateFrameNumbers('teleporter', { start: 0, end: 6, first: 0 }),
            frameRate: 15,
            repeat: 1
        };
        this.scene.anims.create(teleport);
    }


}