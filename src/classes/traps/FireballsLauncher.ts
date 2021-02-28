import { Scene } from 'phaser';
import { Direction } from '../../enums/direction';
import { CustomProperties } from '../../helpers/CustomProperties';

export default class FireballsLauncher extends Phaser.GameObjects.Container {

    private _isActivated: boolean;

    private _assetLauncher: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;

    private _fireballs: Phaser.Physics.Arcade.Sprite[];
    // N E W S
    private _direction: string;
    private _activators: number[] = [];
    private _activationTime: number;

    constructor(x: number, y: number, scene: Scene, properties: CustomProperties[]) {
        super(scene, x, y) // Registering the GameObject of the Player in the provided Scene with it's 2D position.

        this._assetLauncher = this.scene.physics.add.sprite(x, y, 'fireball_launcher');
        this._fireballs = [];
        this._isActivated = properties.filter(p => p.name === 'activated')[0].value as boolean;
        this._direction = properties.filter(p => p.name === 'direction')[0].value as string;
        this._activators = (properties.filter(p => p.name === 'activators')[0].value as string).split('-').map(id => parseInt(id));
        this._activationTime = properties.filter(p => p.name === 'activationTime')[0].value as number;
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

    get activators(): number[] {
        return this._activators;
    }

    get activationTime(): number {
        return this._activationTime;
    }

    public create(): void {

        this.add(this.scene.add.rectangle(0, 0, 32, 32, 0xFF0000));
        this.scene.add.existing(this);
        this.setSize(32, 32);
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