import * as Phaser from 'phaser';


const height = window.innerHeight * devicePixelRatio;
const width = window.innerWidth * devicePixelRatio;

const gameConfig: Phaser.Types.Core.GameConfig = {
    title: 'Game Title',
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width,
        height,
    },
    scene: /* Provide here the startup scene of the Game (e.g.: MainTitleScene)*/ null,
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