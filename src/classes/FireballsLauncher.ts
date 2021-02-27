import { Scene } from 'phaser';
import { Direction } from '../enums/direction';

export default class FireballsLauncher extends Phaser.GameObjects.Container {

    private _isActivated: boolean;

    private _assetLauncher: Phaser.GameObjects.Rectangle;

    private _fireballs: Phaser.Physics.Arcade.Sprite[];
    // N E W S
    private _direction

    private _id;

    constructor(x: number, y: number, scene: Scene, direction: string, id: integer, isActivated: boolean) {
        super(scene, x, y) // Registering the GameObject of the Player in the provided Scene with it's 2D position.

        this._id = id
        this._isActivated = isActivated;
        //this._assetLauncher = this.scene.physics.add.sprite(x, y, 'fireball_launcher')
        this._fireballs = []
        this._direction = direction
    }

    get isActivated(): boolean {
        return this._isActivated;
    }

    set isActivated(value: boolean) {
        this._isActivated = value;
    }

    get id(): number {
        return this._id;
    }

    get assetLauncher():  Phaser.GameObjects.Rectangle{
        return this._assetLauncher;
    }

    get fireballs(): Phaser.Physics.Arcade.Sprite[] {
        return this._fireballs
    }

    public create(): void {
        this._assetLauncher = this.scene.add.rectangle(0, 0, 32, 32, 0xffa500).setOrigin(0.5, 0.5);
        this.add(this._assetLauncher)
        this.setSize(32, 32);
        this.setInteractive();
        this.scene.add.existing(this);
        this.scene.time.addEvent({
            delay: 200,
            callback: () => {
                if(this._isActivated){
                const fireball = this.scene.physics.add.sprite(this.x, this.y, 'fireball')
                if (this._direction === Direction.SOUTH)
                    fireball.setVelocityY(300);
                if (this._direction === Direction.NORTH)
                    fireball.setVelocityY(-300);
                if (this._direction === Direction.WEST)
                    fireball.setVelocityX(-300);
                if (this._direction === Direction.EAST)
                    fireball.setVelocityX(300);
                this._fireballs.push(fireball)
                }
            },
            loop: true
        });
    }

    public update(): void {
        
    }

    public changeState(){
        this._isActivated = !this._isActivated
    }
}