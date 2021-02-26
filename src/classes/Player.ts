import { Scene } from 'phaser';


/**
 * Here we create a Player class that is represented as a Phaser Container in the game Scene.
 * Phaser Containers acts as GameObjects group. It is usefull for manipulate multiple GameObjects at once, 
 * like for moving theme at a same position and a same speed without doing it for every GameObject of the group.
 */
export default class Player extends Phaser.GameObjects.Container {

    private _isAlive: boolean;
    private _cursor;
    private _xPos;
    private _yPos;
    private _player;

    private _body;

    private _playerSpeed;
    private _idle;


    constructor(x: number, y: number, scene: Scene) {
        super(scene, x, y) // Registering the GameObject of the Player in the provided Scene with it's 2D position.

        this._isAlive = true;
        this._playerSpeed = 300;
        this._idle = true;

        this._body = this.body;
        
        this._xPos = x;
        this._yPos = y;
    }

    // Is Alive getter and setter

    get isAlive(): boolean {
        return this._isAlive;
    }

    set isAlive(value: boolean) {
        this._isAlive = value;
    }

    get bod(): Body {
        return this._body;
    }

    public create(): void {

        console.log(this);

        this.setSize(32, 32);

        this._player = this.scene.physics.add.sprite(this._xPos, this._yPos, 'player');

        this._cursor = this.scene.input.keyboard.createCursorKeys();

        this._player.setMaxVelocity(this._playerSpeed, this._playerSpeed);

        this.scene.anims.create({
            key: 'left',
            frames: this.scene.anims.generateFrameNumbers('player', { start: 0, end: 1 }),
            frameRate: 4,
            repeat: -1
        });

        this.scene.anims.create({
            key: 'turn',
            frames: [ { key: 'player', frame: 0 } ],
            frameRate: 4
        });
        
        this.scene.anims.create({
            key: 'idle',
            frames: [ { key: 'player', frame: 0 } ],
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
        if (this._cursor.left.isDown)
        {
            this._idle = false;

            this._player.setVelocityX(-this._playerSpeed);

            this._player.anims.play('left', this._player);
        }
        else if (this._cursor.right.isDown)
        {
            this._idle = false;

            this._player.setVelocityX(this._playerSpeed);

            this._player.anims.play('right', this._player);
        }
        else
        {
            this._idle = true;
            this._player.setVelocityX(0);
        }

        if (this._cursor.up.isDown)
        {
            this._player.setVelocityY(-this._playerSpeed);

            this._player.anims.play('right', this._player);
        }
        else if (this._cursor.down.isDown)
        {
            this._player.setVelocityY(this._playerSpeed);

            this._player.anims.play('right', this._player);
        }
        else
        {
            this._player.setVelocityY(0);

            if(this._idle == true)
                this._player.anims.play('idle', this._player);
        }

        if (this._cursor.space.isDown)
        {

        }
    }
}