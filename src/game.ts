import * as Phaser from 'phaser';
import { Scenes } from './scenes/index.scene';


const height = window.innerHeight * devicePixelRatio;
const width = window.innerWidth * devicePixelRatio;

const gameConfig: Phaser.Types.Core.GameConfig = {
    title: 'Alpaga Rush',
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width,
        height,
    },
    scene: Scenes,
    physics: {
        default: 'arcade',
        arcade: {
            debug: true,
        },
    },

    parent: 'game',
    backgroundColor: '#000000',
};

export const game = new Phaser.Game(gameConfig);