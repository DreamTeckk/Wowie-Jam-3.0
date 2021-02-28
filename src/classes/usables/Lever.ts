import { GameObjects, Scene } from 'phaser';
import { CustomProperties } from '../../helpers/CustomProperties';

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

    constructor(x: number, y: number, scene: Scene, ghost: boolean, properties: CustomProperties[]) {
        super(scene, x, y)
        this._id = properties.filter(p => p.name === 'id')[0].value as number;
        this._xPos = x;
        this._yPos = y;
        this._isActivated = false;
        this._activationTime = properties.filter(p => p.name === 'activationTime')[0].value as number;
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
        this._sounds.push(this.scene.sound.add('leverOpen'));
        this._sounds.push(this.scene.sound.add('leverClose'));
        if (this._ghost !== null) {
            if (this._ghost)
                this.objectSprite = this.scene.physics.add.sprite(0, 0, 'lever_ghost');
            else {
                this.objectSprite = this.scene.physics.add.sprite(0, 0, 'lever');
            }
        } else {
            //console.log('pressure plate')
            this.add(this.scene.add.rectangle(0, 0, 32, 32, 0x582900))
        }
        this.add(this.objectSprite);

        this.setSize(48, 48);
        this.setInteractive();
        this.scene.add.existing(this);

        this.registerAnims();
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

    public changeState(): void {
        if (!this._isActivated) {
            this.playOpen();
            this.objectSprite.play(`lever_${this._ghost ? 'ghost_' : ''}activate`);
        } else {
            this.playClose();
            this.objectSprite.playReverse(`lever_${this._ghost ? 'ghost_' : ''}activate`)
        }
        this._isActivated = !this.isActivated;
    }

    public registerAnims(): void {
        const leverActivateAnim: Phaser.Types.Animations.Animation = {
            key: 'lever_activate',
            frames: this.scene.anims.generateFrameNumbers('lever', { start: 0, end: 1, first: 0 }),
            frameRate: 10,
            repeat: 0
        };
        const leverGhostActivateAnim: Phaser.Types.Animations.Animation = {
            key: 'lever_ghost_activate',
            frames: this.scene.anims.generateFrameNumbers('lever_ghost', { start: 0, end: 1, first: 0 }),
            frameRate: 10,
            repeat: 0
        }

        this.scene.anims.create(leverActivateAnim);
        this.scene.anims.create(leverGhostActivateAnim);
    }
}