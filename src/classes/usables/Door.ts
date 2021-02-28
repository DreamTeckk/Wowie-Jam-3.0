import { Scene } from 'phaser';
import { Direction } from '../../enums/direction';
import { CustomProperties } from '../../helpers/CustomProperties';

export default class Door extends Phaser.GameObjects.Container {

    private _sprite: Phaser.GameObjects.Rectangle;
    private _opened: boolean;
    private _activators: number[];
    private _activationTime: number;
    private _indicatorDirection: string;
    private _indicators: Phaser.GameObjects.Rectangle[] = [];

    constructor(x: number, y: number, scene: Scene, properties: CustomProperties[]) {
        super(scene, x, y)
        this._activators = (properties.filter(p => p.name === 'activators')[0].value as string).split('-').map(id => parseInt(id));
        this._activationTime = properties.filter(p => p.name === 'activationTime')[0].value as number;
        this._opened = false;
        this._indicatorDirection = Direction.NORTH;
    }

    get opened(): boolean {
        return this._opened;
    }

    set opened(open: boolean) {
        this._opened = open;
    }

    get activators(): number[] {
        return this._activators;
    }

    get activationTime(): number {
        return this._activationTime;
    }

    get sprite(): Phaser.GameObjects.Rectangle {
        return this._sprite;
    }

    public create(): void {
        this._sprite = this.scene.add.rectangle(0, 0, 64, 64, 0xdede21).setOrigin(0.5, 0.5);
        this.add(this._sprite)
        this.setSize(32, 32);
        this.setInteractive();
        this.createIndicators();
        this.scene.add.existing(this);
    }

    private createIndicators(): void {
        const tileSize = 64;
        const indicatorNum = this._activators.length;
        const offset = tileSize / (indicatorNum + 1);

        for (let i = 0; i < indicatorNum; i++) {
            switch (this._indicatorDirection) {
                case Direction.NORTH:
                    this._indicators.push(this.scene.add.rectangle(offset * (i + 1) - tileSize / 2, -tileSize + 16, 6, 6, 0x000000).setOrigin(0.5, 0.5));
                    break;
                case Direction.EAST:
                    this._indicators.push(this.scene.add.rectangle(tileSize + 16, offset * (i + 1) - tileSize / 2, 6, 6, 0x000000).setOrigin(0.5, 0.5));
                    break;
                case Direction.SOUTH:
                    this._indicators.push(this.scene.add.rectangle(offset * (i + 1) - tileSize / 2, tileSize + 16, 6, 6, 0x000000).setOrigin(0.5, 0.5));
                    break;
                case Direction.WEST:
                    this._indicators.push(this.scene.add.rectangle(-tileSize + 16, offset * (i + 1) - tileSize / 2, 6, 6, 0x000000).setOrigin(0.5, 0.5));
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
        this._indicators[lastOn - 1].setFillStyle(0x000000);
    }

    public update(): void {
        // 
    }

    public open(): void {
        this._opened = true;
        this.sprite.setFillStyle(0x00ff00);
    }

    public close(): void {
        this._opened = false;
        this.sprite.setFillStyle(0xdede21);
    }
}
