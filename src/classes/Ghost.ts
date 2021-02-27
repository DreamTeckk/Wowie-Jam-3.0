import { Scene } from 'phaser';
import UsableObject from './UsableObject';

export default class Ghost extends Phaser.GameObjects.Container {

    private _speed: number;
    private _isAlive: boolean;
    private _cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    private _asset: Phaser.Types.Physics.Arcade.ImageWithDynamicBody
    private _itemsInRange: Phaser.Physics.Arcade.Body[] | Phaser.Physics.Arcade.StaticBody[];
    private _events: Phaser.Events.EventEmitter = new Phaser.Events.EventEmitter();
    private actionPressed: boolean;
    private _debug

    constructor(x: number, y: number, scene: Scene) {
        super(scene, x, y) // Registering the GameObject of the Player in the provided Scene with it's 2D position.

        this._speed = 150;
        this._isAlive = true;
        this._cursors = this.scene.input.keyboard.createCursorKeys();
        this._asset = this.scene.physics.add.image(x, y, 'ghost');
        this._debug = this.scene.add.text(16, 16, '');
        this.actionPressed = false;
        // this.scene.physics.add.overlap(this._asset, usableObjectsGroup, this.objectAction.bind(this))
    }

    get events(): Phaser.Events.EventEmitter {
        return this._events;
    }

    get asset(): Phaser.Types.Physics.Arcade.ImageWithDynamicBody {
        return this._asset;
    }

    public create(): void {
        this.add(this._asset);
        this.scene.add.existing(this);
    }

    public update(): void {
        //this._debug.text = 'Velocity : '+ this._asset.body.velocity.length() + ' | Speed : ' + this._asset.body.speed + ' | Acceleration : ' + this._asset.body.acceleration.length() 
        if (this._cursors.up.isDown) {
            this._asset.setVelocityY(-this._speed);
            this._itemsInRange
        } else if (this._cursors.down.isDown) {
            this._asset.setVelocityY(this._speed);
        } else {
            this._asset.setVelocityY(0);
        }

        if (this._cursors.left.isDown) {
            this._asset.setVelocityX(-this._speed);
        } else if (this._cursors.right.isDown) {
            this._asset.setVelocityX(this._speed);
        } else {
            this._asset.setVelocityX(0);
        }

        if (this.actionPressed === true && this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE).isUp)
            this.actionPressed = false;

        /*this._itemsInRange = this.scene.physics.overlapRect(this._asset.x,this._asset.y, this._asset.width, this._asset.height)

        this._itemsInRange.forEach((itemInRange:Phaser.Physics.Arcade.Body | Phaser.Physics.Arcade.StaticBody) => {
            //console.log("test")
            //console.log(itemInRange.gameObject)
            //itemInRange.gameObject.destroy();
        });    
        //console.log("test")
        if(this._cursors.space.isDown){
            this._itemsInRange.forEach((itemInRange:Phaser.Physics.Arcade.Body | Phaser.Physics.Arcade.StaticBody) => {
                console.log(itemInRange.gameObject)
                //itemInRange.gameObject.destroy();
            });
        }*/
    }

    public objectAction(object): void {
        if (this._cursors.space.isDown && !this.actionPressed) {
            this.actionPressed = true;
            this._events.emit('interact', object)
        }
    }
}
