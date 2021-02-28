import { Vector } from 'matter';
import { GameObjects, Physics, Scene } from 'phaser';


/**
 * Here we create a Player class that is represented as a Phaser Container in the game Scene.
 * Phaser Containers acts as GameObjects group. It is usefull for manipulate multiple GameObjects at once, 
 * like for moving theme at a same position and a same speed without doing it for every GameObject of the group.
 */
export default class Player extends Phaser.GameObjects.Container {

    private _isAlive: boolean;
    private cursor: Phaser.Types.Input.Keyboard.CursorKeys;
    private xPos: number;
    private yPos: number;
    private _player: Physics.Arcade.Sprite;
    private actionPressed: boolean
    private _events: Phaser.Events.EventEmitter = new Phaser.Events.EventEmitter();

    private playerSpeed: number;
    private idle;

    private playerVelocity: Vector;


    constructor(x: number, y: number, scene: Scene) {
        super(scene, x, y) // Registering the GameObject of the Player in the provided Scene with it's 2D position.

        this._isAlive = true;
        this.playerSpeed = 300;
        this.idle = true;
        this.xPos = x;
        this.yPos = y;
        this.actionPressed = false;
    }

    // Is Alive getter and setter

    get isAlive(): boolean {
        return this._isAlive;
    }

    set isAlive(value: boolean) {
        this._isAlive = value;
    }

    get player(): Phaser.GameObjects.Sprite {
        return this._player
    }

    get events(): Phaser.Events.EventEmitter {
        return this._events;
    }

    public create(): void {

        this.setSize(32, 32);
        this._player = this.scene.physics.add.sprite(0, 0, 'player');

        this._player.setMaxVelocity(this.playerSpeed);

        this.cursor = this.scene.input.keyboard.createCursorKeys();

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

    public draw(): void {
        this.add(this._player);
    }

    public update(): void {
        if (this._isAlive) {
            if (this.cursor.left.isDown) {
                this.idle = false;
                this._player.setVelocityX(-this.playerSpeed);

                this._player.anims.play('left');
            }
            else if (this.cursor.right.isDown) {
                this.idle = false;

                this._player.setVelocityX(this.playerSpeed);

                this._player.anims.play('right');
            }
            else {
                this.idle = true;
                this._player.setVelocityX(0);
            }

            if (this.cursor.up.isDown) {
                this._player.setVelocityY(-this.playerSpeed);

                this._player.anims.play('right');
            }
            else if (this.cursor.down.isDown) {
                this._player.setVelocityY(this.playerSpeed);

                this._player.anims.play('right');
            }
            else {
                this._player.setVelocityY(0);

                if (this.idle == true)
                    this._player.anims.play('idle');
            }

            if (this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE).isUp)
                if (this.actionPressed === true)
                    this.actionPressed = false;
        }
    }

    public objectAction(object): void {
        if (this.cursor.space.isDown && !this.actionPressed && this.isAlive) {
            this.actionPressed = true;
            this._events.emit('interact', object)
        }
    }

    public death(): void {
        if (this._isAlive) {
            //console.log("t mor lol")
            this._isAlive = false;

            if (this.player.body.velocity.x > 0) {
                //console.log("x > 0");
                this._player.setPosition(this.player.x - 22, this.player.y);
            }
            if (this.player.body.velocity.y > 0) {
                //console.log("y > 0");
                this._player.setPosition(this.player.x, this.player.y - 22);
            }
            if (this.player.body.velocity.x < 0) {
                //console.log("x < 0");
                this._player.setPosition(this.player.x + 22, this.player.y);
            }
            if (this.player.body.velocity.y < 0) {
                //console.log("y < 0");
                this._player.setPosition(this.player.x, this.player.y + 22);
            }
            this._player.setVelocityX(0);
            this._player.setVelocityY(0);
            this._player.setActive(false)
        }
    }

    public revive(): void {
        this.scene.time.delayedCall(500, () => {
            this._isAlive = true;
            this._player.setActive(true)
        })
        //this._isAlive = true;
        //this._player.setActive(true).setVisible(true);
    }

    public reviveTeleport(x, y): void {
        this._player.setPosition(x, y);
        this.scene.time.delayedCall(500, () => {
            this._isAlive = true;
            this.player.setActive(true)
        })
    }
}