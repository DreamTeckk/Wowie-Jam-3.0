import { GameObjects, Scene } from 'phaser';

/**
 * Here we create a Player class that is represented as a Phaser Container in the game Scene.
 * Phaser Containers acts as GameObjects group. It is usefull for manipulate multiple GameObjects at once, 
 * like for moving theme at a same position and a same speed without doing it for every GameObject of the group.
 */
export default class Ghost extends Phaser.GameObjects.Container {

    private _timeLeft: number;
    private _speed: number;
    private _isAlive: boolean;
    private _cursors: Phaser.Types.Input.Keyboard.CursorKeys;    
    private _asset : Phaser.Types.Physics.Arcade.ImageWithDynamicBody
    private _itemsInRange: Phaser.Physics.Arcade.Body[] | Phaser.Physics.Arcade.StaticBody[];

    private _debug

    constructor(x: number, y: number, scene: Scene) {
        super(scene, x, y) // Registering the GameObject of the Player in the provided Scene with it's 2D position.
        
        this._speed = 300;
        this._isAlive = true;
        this._cursors = this.scene.input.keyboard.createCursorKeys();
        this._asset = this.scene.physics.add.image(32,32,'ghost');
        this._debug = this.scene.add.text(16,16, '');
        this._itemsInRange = this.scene.physics.overlapCirc(x,y, this._asset.height+100)
    }

    // Speed getter and setter
    //...

    // Damage Points getter and setter
    //...

    // Is Alive getter and setter
    //...

    public create(): void {
        this.add(this._asset);
        /**
         * The function called in the Game or Factory create() method.
         * 
         * Here are initialized all the assets, animations, and visual or sound dependencies of the Player
         */ 
    }  

    public update(): void {
        this._debug.text = 'Velocity : '+ this._asset.body.velocity.length() + ' | Speed :' + this._asset.body.speed + ' | Acceleration' + this._asset.body.acceleration.length() 
        if(this._cursors.up.isDown){
            this._asset.setVelocityY(-this._speed);
        }else if(this._cursors.down.isDown){
            this._asset.setVelocityY(this._speed);
        }else{
            this._asset.setVelocityY(0);
        }

        if(this._cursors.left.isDown){
            this._asset.setVelocityX(-this._speed);
        }if(this._cursors.right.isDown){
            this._asset.setVelocityX(this._speed);
        }else{
            this._asset.setVelocityX(0);
        }        

        if(this._cursors.space.isDown){
            this._itemsInRange.forEach(itemInRange => {
                itemInRange.GameObject.actionGhost();
            });
        }
        /**
         * The function called in the Game or Factory update() method.
         * 
         * Here are all the Player visual, sound or parameters update that should be applied 
         * every time the Game Canvas update.
         * 
         * A simple expemple is the Player's position update : 
         * - every update we check if a direction key is pressed.
         * - if it's true, we update the x and y position of the Player depending on his speed.
         * 
         * TIPS : Phaser automatically update animations with spritesheets when created.
         */ 
    }
}
