import * as Phaser from 'phaser';
import MenuScene from './scenes/MenuScene';
import TestScene from './scenes/Test.scene';


const gameConfig: Phaser.Types.Core.GameConfig = {
    title: 'TU MEURS TU GAGNES',
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.NONE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 1200,
        height: 800,
    },
    scene: [TestScene],
    physics: {
        default: 'arcade',
        arcade: {
            debug: false,
        },
    },
    parent: 'game',
    backgroundColor: '#4587de',
    zoom: 1.1
};

export const game = new Phaser.Game(gameConfig);