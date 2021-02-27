import { Scene } from 'phaser';

export default class FireballsLauncher extends Phaser.GameObjects.Container {

    private _isActivated: boolean;

    private _assetLauncher: Phaser.Physics.Arcade.Sprite;

    private _fireballs: Phaser.Physics.Arcade.Sprite[];

    // N E W S
    private _direction

    private _walls

    constructor(x: number, y: number, scene: Scene, walls, direction: string) {
        super(scene, x, y) // Registering the GameObject of the Player in the provided Scene with it's 2D position.

        this._isActivated = true;
        this._assetLauncher = this.scene.physics.add.sprite(x,y,'fireball_launcher')
        this._walls = walls
        this._fireballs = []
        this._direction = direction
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

    public create(): void {
        this.scene.time.addEvent({
            delay: 200,
            callback: () => {
                let fireball = this.scene.physics.add.sprite(this._assetLauncher.x,this._assetLauncher.y, 'fireball')
                if(this._direction === 'S')
                    fireball.setVelocityY(300);
                if(this._direction === 'N')
                    fireball.setVelocityY(-300);
                if(this._direction === 'W')
                    fireball.setVelocityX(-300);
                if(this._direction === 'E')
                    fireball.setVelocityX(300);
                this._fireballs.push(fireball)
            },
            loop: true
        });
    }

    public update(): void {
        
    }


}