import { Scene } from 'phaser';
import { Direction } from '../enums/direction';

export default class FireballsLauncher extends Phaser.GameObjects.Container {

    private _isActivated: boolean;

    private _assetLauncher: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;

    private _fireballs: Phaser.Physics.Arcade.Sprite[];
    // N E W S
    private _direction: string;
    private _activationPatern: string[];
    private _leverPatern: number[] = [];

    constructor(x: number, y: number, scene: Scene, objectName: string) {
        super(scene, x, y) // Registering the GameObject of the Player in the provided Scene with it's 2D position.

        this._activationPatern = objectName.split('-');
        this._assetLauncher = this.scene.physics.add.sprite(x, y, 'fireball_launcher')
        this._fireballs = []
        this._isActivated = this._activationPatern[this._activationPatern.length - 2] === 'T' ? true : false;
        this._direction = this._activationPatern[this._activationPatern.length - 3];
        this._leverPatern = this._activationPatern.slice(0, this._activationPatern.length - 3).map(v => parseInt(v));
    }

    get isActivated(): boolean {
        return this._isActivated;
    }

    set isActivated(value: boolean) {
        this._isActivated = value;
    }

    get assetLauncher(): Phaser.Types.Physics.Arcade.SpriteWithDynamicBody {
        return this._assetLauncher;
    }

    get fireballs(): Phaser.Physics.Arcade.Sprite[] {
        return this._fireballs
    }

    get activationPatern(): string[] {
        return this._activationPatern;
    }

    get leverPattern(): number[] {
        return this._leverPatern;
    }

    public create(): void {
        this.add(this.scene.add.rectangle(0, 0, 32, 32, 0xFF0000));
        this.scene.add.existing(this);
        this.scene.time.addEvent({
            delay: 500,
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

    public changeState(): void {
        this._isActivated = !this._isActivated
    }

}