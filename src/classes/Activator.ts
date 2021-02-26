import { Scene } from 'phaser';


/**
 * Here we create a Player class that is represented as a Phaser Container in the game Scene.
 * Phaser Containers acts as GameObjects group. It is usefull for manipulate multiple GameObjects at once, 
 * like for moving theme at a same position and a same speed without doing it for every GameObject of the group.
 */
export default class Activator extends Phaser.GameObjects.Container {

    private _activator;

    private _xPos;
    private _yPos;

    private _isActivated : boolean;



    constructor(x: number, y: number, scene: Scene) {
        super(scene, x, y) // Registering the GameObject of the Player in the provided Scene with it's 2D position.

        this._isActivated = true;
        this._xPos = x;
        this._yPos = y;
    }


    public create(): void {
        this._activator = this.scene.physics.add.sprite(this._xPos, this._yPos, 'activator');

        //this.physics.add.collider(stars, platforms);
    }  

    public update(): void {
        
    }
}