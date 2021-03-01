import { Scene } from 'phaser';

export default class Ghost extends Phaser.GameObjects.Container {

    private _speed: number;
    private _isAlive: boolean;
    private _cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    private _objectSprite: Phaser.Physics.Arcade.Sprite;
    private _itemsInRange: Phaser.Physics.Arcade.Body[] | Phaser.Physics.Arcade.StaticBody[];
    private _events: Phaser.Events.EventEmitter = new Phaser.Events.EventEmitter();
    private actionPressed: boolean;
    private _debug

    constructor(x: number, y: number, scene: Scene) {
        super(scene, x, y) // Registering the GameObject of the Player in the provided Scene with it's 2D position.

        this._speed = 300;
        this._isAlive = true;
        this._cursors = this.scene.input.keyboard.createCursorKeys();
        this._objectSprite = this.scene.physics.add.sprite(0, 0, 'ghost');
        this._debug = this.scene.add.text(16, 16, '');
        this.actionPressed = false;
        // this.scene.physics.add.overlap(this._asset, usableObjectsGroup, this.objectAction.bind(this))
    }

    get events(): Phaser.Events.EventEmitter {
        return this._events;
    }

    get asset(): Phaser.Physics.Arcade.Sprite {
        return this._objectSprite;
    }

    public create(): void {
        this.add(this._objectSprite);
        this._objectSprite.setSize(14, 7);
        this._objectSprite.setOffset(6, 25);
        this.scene.add.existing(this);
        this.asset.setActive(false).setVisible(false);
        this.registerAnims();
    }

    public update(): void {
        if (this._cursors.up.isDown) {
            this._objectSprite.setVelocityY(-this._speed);
            //this._itemsInRange;
        } else if (this._cursors.down.isDown) {
            this._objectSprite.setVelocityY(this._speed);
        } else {
            this._objectSprite.setVelocityY(0);
        }

        if (this._cursors.left.isDown) {
            this._objectSprite.setVelocityX(-this._speed);
            if (!this._objectSprite.anims.currentAnim || this._objectSprite.anims.currentAnim.key !== 'ghost_run_left')
                this._objectSprite.play('ghost_run_left');
        } else if (this._cursors.right.isDown) {
            this._objectSprite.setVelocityX(this._speed);
            if (!this._objectSprite.anims.currentAnim || this._objectSprite.anims.currentAnim.key !== 'ghost_run_right')
                this._objectSprite.play('ghost_run_right');
        } else {
            this._objectSprite.setVelocityX(0);
            if (!this._objectSprite.anims.currentAnim || this._objectSprite.anims.currentAnim.key !== 'ghost_run_left')
                this._objectSprite.play('ghost_run_left');
        }

        if (this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE).isUp)
            if (this.actionPressed === true)
                this.actionPressed = false;
    }

    public objectAction(object): void {
        if (this._cursors.space.isDown && !this.actionPressed && !this._isAlive) {
            this.actionPressed = true;
            this._events.emit('interact', object)
        }
    }

    public death(x: number, y: number): void {
        this._objectSprite.setActive(true).setVisible(true);
        this._objectSprite.setPosition(x, y);
        this._isAlive = false;
    }

    public revive(x: number, y: number): void {
        this._objectSprite.setActive(false).setVisible(false);
        this._objectSprite.setPosition(x, y);
        this._isAlive = true;
    }

    public reviveTeleport(): void {
        this._isAlive = true;
        this._objectSprite.setActive(false).setVisible(false);
    }

    public registerAnims(): void {
        const leverActivateAnim: Phaser.Types.Animations.Animation = {
            key: 'ghost_run_left',
            frames: this.scene.anims.generateFrameNumbers('ghost', { start: 4, end: 7, first: 4 }),
            frameRate: 12,
            repeat: -1
        };
        const leverGhostActivateAnim: Phaser.Types.Animations.Animation = {
            key: 'ghost_run_right',
            frames: this.scene.anims.generateFrameNumbers('ghost', { start: 0, end: 3, first: 0 }),
            frameRate: 12,
            repeat: -1
        }

        this.scene.anims.create(leverActivateAnim);
        this.scene.anims.create(leverGhostActivateAnim);
    }
}
