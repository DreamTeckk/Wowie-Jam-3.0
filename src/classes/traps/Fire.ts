import { Scene } from 'phaser';
import { Direction } from '../../enums/direction';
import { CustomProperties } from '../../helpers/CustomProperties';
export default class Fire extends Phaser.GameObjects.Container {

    private _isActivated: boolean;
    private _objectSprite: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    private _activationTime: number;
    private fire: Phaser.GameObjects.Sprite;
    private _indicatorDirection: string;
    private _indicators: Phaser.GameObjects.Rectangle[] = [];
    private _activators: number[] = [];

    constructor(x: number, y: number, scene: Scene, properties: CustomProperties[]) {
        super(scene, x, y) // Registering the GameObject of the Player in the provided Scene with it's 2D position.

        this._isActivated = properties.filter(p => p.name === 'activated')[0].value as boolean;
        this._activators = (properties.filter(p => p.name === 'activators')[0].value as string).split('-').map(id => parseInt(id));
        this._activationTime = properties.filter(p => p.name === 'activationTime')[0].value as number;
        this._indicatorDirection = Direction.NORTH;
    }

    get isActivated(): boolean {
        return this._isActivated;
    }

    set isActivated(value: boolean) {
        this._isActivated = value;
    }

    get objectSprite(): Phaser.Types.Physics.Arcade.SpriteWithDynamicBody {
        return this._objectSprite;
    }

    get activators(): number[] {
        return this._activators;
    }

    get activationTime(): number {
        return this._activationTime;
    }

    public create(): void {
        if (isNaN(this._activators[0]))
            this._activators = [];
        this._objectSprite = this.scene.physics.add.sprite(0, 0, 'firebase', 0);
        this.fire = this.scene.physics.add.sprite(0, 0, 'fire', 0);
        this.add(this._objectSprite);
        if (this._isActivated)
            this.add(this.fire)
        this.scene.add.existing(this);
        this.setSize(32, 32);
        this.createIndicators();
        this.scene.add.existing(this);
    }

    public update(): void {
        //
    }

    private createIndicators(): void {
        const tileSize = 32;
        const indicatorNum = this.activators.length;
        const offset = tileSize / (indicatorNum + 1)

        for (let i = 0; i < indicatorNum; i++) {
            switch (this._indicatorDirection) {
                case Direction.NORTH:
                    this._indicators.push(this.scene.add.rectangle(offset * (i + 1) - tileSize / 2, -tileSize + 16, 4, 4, 0x000000).setOrigin(0.5, 0.5));
                    break;
                case Direction.EAST:
                    this._indicators.push(this.scene.add.rectangle(tileSize + 16, offset * (i + 1) - tileSize / 2, 4, 4, 0x000000).setOrigin(0.5, 0.5));
                    break;
                case Direction.SOUTH:
                    this._indicators.push(this.scene.add.rectangle(offset * (i + 1) - tileSize / 2, tileSize + 16, 4, 4, 0x000000).setOrigin(0.5, 0.5));
                    break;
                case Direction.WEST:
                    this._indicators.push(this.scene.add.rectangle(-tileSize + 16, offset * (i + 1) - tileSize / 2, 4, 4, 0x000000).setOrigin(0.5, 0.5));
                    break;
                default:
                    break;
            }
            this.add(this._indicators[i]);
        }
    }

    public activateIndicator(n: number): void {
        for (let i = 0; i < n; i++) {
            this._indicators[i].setFillStyle(0x34ebde);
        }
    }

    public desactivateIndicator(): void {
        const lastOn = this._indicators.filter(indic => indic.fillColor === 0x34ebde).length;
        if (lastOn)
            this._indicators[lastOn - 1].setFillStyle(0x000000);
    }

    public changeState(): void {
        this._isActivated = !this._isActivated
        if (this._isActivated) {
            this.add(this.fire);
        }
        else {
            this.remove(this.fire);
        }
    }

}