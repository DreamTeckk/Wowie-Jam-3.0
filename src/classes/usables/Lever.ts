import { GameObjects, Scene } from 'phaser';

export default class Lever extends Phaser.GameObjects.Container {

    private sprite: GameObjects.Rectangle;
    private _id: number;
    private _xPos: number;
    private _yPos: number;
    private _isActivated: boolean;
    private objectSprite: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    private _activationTime: number;
    private _ghost: boolean;
    private _sounds: Phaser.Sound.BaseSound[] = [];

    constructor(x: number, y: number, id: number, scene: Scene, ghost: boolean) {
        super(scene, x, y)
        this._id = id;
        this._isActivated = true;
        this._xPos = x;
        this._yPos = y;
        this._isActivated = false;
        this._activationTime = 10000;
        this._ghost = ghost;
    }

    get id(): number {
        return this._id;

    }

    set id(newId: number) {
        this._id = newId;
    }

    get isActivated(): boolean {
        return this._isActivated;
    }

    set isActivated(value: boolean) {
        this._isActivated = value;
    }

    get ghost(): boolean {
        return this.ghost;
    }

    set ghost(value: boolean) {
        this._ghost = value;
    }

    get activationTime(): number {
        return this._activationTime;
    }

    public create(): void {
        this._sounds.push(this.scene.sound.add('leverOpen'))
        this._sounds.push(this.scene.sound.add('leverClose'))
        this.objectSprite = this.scene.physics.add.sprite(0, 0, 'activator');
        this.add(this.objectSprite)
        if(this._ghost !== null){
            if (this._ghost)
                this.add(this.scene.add.rectangle(0, 0, 32, 32, 0xffffff))
            else
                this.add(this.scene.add.rectangle(0, 0, 32, 32, 0xaaaaaa))
        }else{
            console.log('pressure plate')
            this.add(this.scene.add.rectangle(0, 0, 32, 32, 0x582900))
        }
        
        this.setSize(48, 48);
        this.setInteractive();
        this.scene.add.existing(this);
    }

    public update(): void {
        // 
    }

    public playOpen(): void {
        this._sounds[0].play()
    }

    public playClose(): void {
        this._sounds[1].play()
    }
}