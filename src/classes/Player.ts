import { GameObjects, Scene } from 'phaser';


/**
 * Here we create a Player class that is represented as a Phaser Container in the game Scene.
 * Phaser Containers acts as GameObjects group. It is usefull for manipulate multiple GameObjects at once, 
 * like for moving theme at a same position and a same speed without doing it for every GameObject of the group.
 */
export default class Player extends Phaser.GameObjects.Container {

    private _isAlive: boolean;
    private cursor;
    private xPos;
    private yPos;
    private player;

    private playerSpeed;
    private idle;


    constructor(x: number, y: number, scene: Scene) {
        super(scene, x, y) // Registering the GameObject of the Player in the provided Scene with it's 2D position.

        this._isAlive = true;
        this.playerSpeed = 300;
        this.idle = true;
        this.xPos = x;
        this.yPos = y;
    }

    // Is Alive getter and setter

    get isAlive(): boolean {
        return this._isAlive;
    }

    set isAlive(value: boolean) {
        this._isAlive = value;
    }

    get _body(): Phaser.Physics.Arcade.Body | Phaser.Physics.Arcade.StaticBody | MatterJS.BodyType {
        return this.body
    }

    public create(): void {

        this.setSize(32, 32);
        this.player = this.scene.physics.add.sprite(this.xPos, this.yPos, 'player');
        this.add(this.player);
        this.body = this.player;

        this.player.body.setMaxSpeed(this.playerSpeed);

        this.cursor = this.scene.input.keyboard.createCursorKeys();

        this.player.setMaxVelocity(this.playerSpeed, this.playerSpeed);

        this.scene.anims.create({
            key: 'left',
            frames: this.scene.anims.generateFrameNumbers('player', { start: 0, end: 1 }),
            frameRate: 4,
            repeat: -1
        });

        this.scene.anims.create({
            key: 'turn',
            frames: [{ key: 'player', frame: 0 }],
            frameRate: 4
        });

        this.scene.anims.create({
            key: 'idle',
            frames: [{ key: 'player', frame: 0 }],
            frameRate: 4
        });

        this.scene.anims.create({
            key: 'right',
            frames: this.scene.anims.generateFrameNumbers('player', { start: 2, end: 3 }),
            frameRate: 4,
            repeat: -1
        });

        this.scene.add.existing(this);
    }

    public update(): void {
        if (this.cursor.left.isDown) {
            this.idle = false;

            this.player.setVelocityX(-this.playerSpeed);

            this.player.anims.play('left', this.player);
        }
        else if (this.cursor.right.isDown) {
            this.idle = false;

            this.player.setVelocityX(this.playerSpeed);

            this.player.anims.play('right', this.player);
        }
        else {
            this.idle = true;
            this.player.setVelocityX(0);
        }

        if (this.cursor.up.isDown) {
            this.player.setVelocityY(-this.playerSpeed);

            this.player.anims.play('right', this.player);
        }
        else if (this.cursor.down.isDown) {
            this.player.setVelocityY(this.playerSpeed);

            this.player.anims.play('right', this.player);
        }
        else {
            this.player.setVelocityY(0);

            if (this.idle == true)
                this.player.anims.play('idle', this.player);
        }

        if (this.cursor.space.isDown) {

        }
    }
}