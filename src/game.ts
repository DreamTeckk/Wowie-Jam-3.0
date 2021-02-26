import * as Phaser from 'phaser';
<<<<<<< HEAD
import MyScene from './scenes/MyScene';


const height = window.innerHeight * devicePixelRatio;
const width = window.innerWidth * devicePixelRatio;
=======
import TestScene from './scenes/Test.scene';
>>>>>>> 47bbc6711de24d9a1c2a49398a08db48ba24ae91

const gameConfig: Phaser.Types.Core.GameConfig = {
    title: 'TU MEURS TU GAGNES',
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.NONE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 1000,
        height: 600,
    },
<<<<<<< HEAD
    scene: /* Provide here the startup scene of the Game (e.g.: MainTitleScene)*/ MyScene,
=======
    scene: TestScene,
>>>>>>> 47bbc6711de24d9a1c2a49398a08db48ba24ae91
    physics: {
        default: 'arcade',
        arcade: {
            debug: true,
        },
    },
    parent: 'game',
<<<<<<< HEAD
    backgroundColor: '#FFFFFF',
=======
    backgroundColor: '#aaa',
>>>>>>> 47bbc6711de24d9a1c2a49398a08db48ba24ae91
};

export const game = new Phaser.Game(gameConfig);