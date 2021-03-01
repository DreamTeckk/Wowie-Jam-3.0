import { Vector } from 'matter';
import { Scene } from 'phaser';


/**
 * Here we create a Player class that is represented as a Phaser Container in the game Scene.
 * Phaser Containers acts as GameObjects group. It is usefull for manipulate multiple GameObjects at once, 
 * like for moving theme at a same position and a same speed without doing it for every GameObject of the group.
 */
export default class Player extends Phaser.GameObjects.Container {

    private _isAlive: boolean;
    private _cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    private xPos: number;
    private yPos: number;
    private _objectSprite: Phaser.Physics.Arcade.Sprite;
    private actionPressed: boolean
    private _events: Phaser.Events.EventEmitter = new Phaser.Events.EventEmitter();
    private deathSound: Phaser.Sound.BaseSound;
    private reviveSound: Phaser.Sound.BaseSound;

    private _speed: number;
    private idle;

    private playerVelocity: Vector;


    constructor(x: number, y: number, scene: Scene) {
        super(scene, x, y) // Registering the GameObject of the Player in the provided Scene with it's 2D position.

        this._isAlive = true;
        this._speed = 300;
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

    get objectSprite(): Phaser.GameObjects.Sprite {
        return this._objectSprite
    }

    get events(): Phaser.Events.EventEmitter {
        return this._events;
    }

    public create(): void {

        this.setSize(24, 24);
        this._objectSprite = this.scene.physics.add.sprite(0, 0, 'player');
        this._objectSprite.setMaxVelocity(this._speed);
        this._cursors = this.scene.input.keyboard.createCursorKeys();
        this.registerAnims();
        this.deathSound = this.scene.sound.add('death', { volume: 0.1 });
        this.reviveSound = this.scene.sound.add('revive', { volume: 0.2 });
        this.scene.add.existing(this);

    }

    public draw(): void {
        this.add(this._objectSprite);
    }

    public update(): void {
        if (this._isAlive) {
            this.idle = true;
            if (this._cursors.up.isDown) {
                this._objectSprite.setVelocityY(-this._speed);
                if (!this._objectSprite.anims.currentAnim || this._objectSprite.anims.currentAnim.key !== 'player_run_left')
                    this._objectSprite.play('player_run_left');
                this.idle = false
            } else if (this._cursors.down.isDown) {
                this._objectSprite.setVelocityY(this._speed);
                if (!this._objectSprite.anims.currentAnim || this._objectSprite.anims.currentAnim.key !== 'player_run_left')
                    this._objectSprite.play('player_run_left');
                this.idle = false
            } else {
                this._objectSprite.setVelocityY(0);
            }

            if (this._cursors.left.isDown) {
                this._objectSprite.setVelocityX(-this._speed);
                if (!this._objectSprite.anims.currentAnim || this._objectSprite.anims.currentAnim.key !== 'player_run_left')
                    this._objectSprite.play('player_run_left');
                this.idle = false
            } else if (this._cursors.right.isDown) {
                this._objectSprite.setVelocityX(this._speed);
                if (!this._objectSprite.anims.currentAnim || this._objectSprite.anims.currentAnim.key !== 'player_run_right')
                    this._objectSprite.play('player_run_right');
                this.idle = false
            } else {
                this._objectSprite.setVelocityX(0);
            }

            if ((!this._objectSprite.anims.currentAnim || this._objectSprite.anims.currentAnim.key !== 'player_idle') && this.idle)
                this._objectSprite.play('player_idle');

            if (this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE).isUp)
                if (this.actionPressed === true)
                    this.actionPressed = false;
        }
    }

    public objectAction(object): void {
        if (this._cursors.space.isDown && !this.actionPressed && this.isAlive) {
            this.actionPressed = true;
            this._events.emit('interact', object)
        }
    }

    public death(): void {
        if (this._isAlive) {
            this._isAlive = false;
            this.deathSound.play();
            this._objectSprite.anims.play('player_die').once('animationcomplete', () => {
                this._objectSprite.setActive(false)
            })
            if (this._objectSprite.body.velocity.x > 0) {
                this._objectSprite.setPosition(this._objectSprite.x - 22, this._objectSprite.y);
            }
            if (this._objectSprite.body.velocity.y > 0) {
                this._objectSprite.setPosition(this._objectSprite.x, this._objectSprite.y - 22);
            }
            if (this._objectSprite.body.velocity.x < 0) {
                this._objectSprite.setPosition(this._objectSprite.x + 22, this._objectSprite.y);
            }
            if (this._objectSprite.body.velocity.y < 0) {
                this._objectSprite.setPosition(this._objectSprite.x, this._objectSprite.y + 22);
            }
            this._objectSprite.setVelocityX(0);
            this._objectSprite.setVelocityY(0);
        }
    }

    public revive(): void {
        this.scene.time.delayedCall(500, () => {
            this.reviveSound.play();
            this._objectSprite.setActive(true)
            this._objectSprite.anims.play('player_revive').once('animationcomplete', () => {
                this._isAlive = true
            })
        })
    }

    public reviveTeleport(x, y): void {
        this._objectSprite.setPosition(x, y);
        this.scene.time.delayedCall(500, () => {
            this._objectSprite.setActive(true)
            this._objectSprite.anims.play('player_revive').once('animationcomplete', () => {
                this._isAlive = true
            })
        })
    }

    public registerAnims(): void {

        const idleAnimation: Phaser.Types.Animations.Animation = {
            key: 'player_idle',
            frames: this.scene.anims.generateFrameNumbers('player', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        }
        const runLeftAnimation: Phaser.Types.Animations.Animation = {
            key: 'player_run_left',
            frames: this.scene.anims.generateFrameNumbers('player', { start: 5, end: 11 }),
            frameRate: 15,
            repeat: -1
        }
        const runRightAnimation: Phaser.Types.Animations.Animation = {
            key: 'player_run_right',
            frames: this.scene.anims.generateFrameNumbers('player', { start: 13, end: 19 }),
            frameRate: 15,
            repeat: -1
        }
        const dieAnimation: Phaser.Types.Animations.Animation = {
            key: 'player_die',
            frames: this.scene.anims.generateFrameNumbers('player', { start: 21, end: 26 }),
            frameRate: 15,
            repeat: 0
        }
        const reviveAnimation: Phaser.Types.Animations.Animation = {
            key: 'player_revive',
            frames: this.scene.anims.generateFrameNumbers('player', { start: 28, end: 33 }),
            frameRate: 20,
            repeat: 0
        }

        this.scene.anims.create(idleAnimation);
        this.scene.anims.create(runLeftAnimation);
        this.scene.anims.create(runRightAnimation);
        this.scene.anims.create(dieAnimation);
        this.scene.anims.create(reviveAnimation);
    }

}