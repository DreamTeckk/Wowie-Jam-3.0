import { Scene } from 'phaser';

export default class UsableObject extends Phaser.GameObjects.Container {

    private _isActivated: boolean;
    private _asset : Phaser.Types.Physics.Arcade.ImageWithDynamicBody

    constructor(x: number, y: number, scene: Scene) {
        super(scene, x, y) // Registering the GameObject of the Player in the provided Scene with it's 2D position.

        this._asset = this.scene.physics.add.image(x,y,'ghost2');
    }

    public create(): void {
        this.add(this._asset);
    }  

    public update(): void {
    }

    public actionGhost(){
        
        console.log('used !')
    }
}
