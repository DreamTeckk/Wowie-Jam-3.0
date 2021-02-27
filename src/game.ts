import * as Phaser from 'phaser';
import TestScene from './scenes/Test.scene';
import CreditScene from './scenes/CreditScene';


const height = window.innerHeight * devicePixelRatio;
const width = window.innerWidth * devicePixelRatio;


const gameConfig: Phaser.Types.Core.GameConfig = {
    title: 'TU MEURS TU GAGNES',
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.NONE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 1200,
        height: 800,
    },
    scene: [TestScene,CreditScene],
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