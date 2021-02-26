import * as Phaser from 'phaser';
import MyScene from './scenes/MyScene';


const height = window.innerHeight * devicePixelRatio;
const width = window.innerWidth * devicePixelRatio;

const gameConfig: Phaser.Types.Core.GameConfig = {
    title: 'TU MEURS TU GAGNES',
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width,
        height,
    },
    scene: /* Provide here the startup scene of the Game (e.g.: MainTitleScene)*/ MyScene,
    physics: {
        default: 'arcade',
        arcade: {
            debug: true,
        },
    },

    parent: 'game',
    backgroundColor: '#FFFFFF',
};

export const game = new Phaser.Game(gameConfig);