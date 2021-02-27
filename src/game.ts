import * as Phaser from 'phaser';
import TestScene from './scenes/Test.scene';


const height = window.innerHeight * devicePixelRatio;
const width = window.innerWidth * devicePixelRatio;


const gameConfig: Phaser.Types.Core.GameConfig = {
    title: 'TU MEURS TU GAGNES',
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.NONE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 1000,
        height: 600,
    },
    scene: TestScene,
    physics: {
        default: 'arcade',
        arcade: {
            debug: true,
        },
    },
    parent: 'game',
    backgroundColor: '#aaa',
    zoom: 1.0001
};

export const game = new Phaser.Game(gameConfig);