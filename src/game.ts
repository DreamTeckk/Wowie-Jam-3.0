import * as Phaser from 'phaser';
import TestScene from './scenes/Test.scene';

const gameConfig: Phaser.Types.Core.GameConfig = {
    title: 'Game Title',
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
};

export const game = new Phaser.Game(gameConfig);