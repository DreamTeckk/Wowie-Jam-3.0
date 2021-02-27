import { Scene } from 'phaser';
import { Direction } from '../enums/direction';

export default class FireballsLauncher extends Phaser.GameObjects.Container {

    private _isActivated: boolean;

    private _assetLauncher: Phaser.Physics.Arcade.Sprite;

    private _fireballs: Phaser.Physics.Arcade.Sprite[];

    // N E W S
    private _direction: string;

    private _activationPatern: string[];

    constructor(x: number, y: number, scene: Scene, objectName: string) {
        super(scene, x, y) // Registering the GameObject of the Player in the provided Scene with it's 2D position.

        this._activationPatern = objectName.split('-');
        this._assetLauncher = this.scene.physics.add.sprite(x, y, 'fireball_launcher')
        this._fireballs = []
        this._isActivated = this._activationPatern[this._activationPatern.length - 1] === 'T' ? true : false;
        this._direction = this._activationPatern[this._activationPatern.length - 2];
    }

    get isActivated(): boolean {
        return this._isActivated;
    }

    set isActivated(value: boolean) {
        this._isActivated = value;
    }

    get fireballs(): Phaser.Physics.Arcade.Sprite[] {
        return this._fireballs
    }

    get activationPatern(): string[] {
        return this._activationPatern;
    }

    public create(): void {
        this.add(this.scene.add.rectangle(0, 0, 32, 32, 0xFF0000));
        this.scene.add.existing(this);
        this.scene.time.addEvent({
            delay: 1000,
            callback: () => {
                if (this._isActivated) {
                    const fireball = this.scene.physics.add.sprite(this._assetLauncher.x, this._assetLauncher.y, 'fireball')
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
        //
    }


}