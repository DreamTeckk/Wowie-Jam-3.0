import * as Phaser from 'phaser';
import MenuScene from './scenes/MenuScene';
import Level1Scene from './scenes/LevelScenes/Level1.scene';
import Level2Scene from './scenes/LevelScenes/Level2.scene';
import Level3Scene from './scenes/LevelScenes/Level3.scene';
import Level4Scene from './scenes/LevelScenes/Level4.scene';
import Level5Scene from './scenes/LevelScenes/Level5.scene';
import Level6Scene from './scenes/LevelScenes/Level6.scene';
import Level7Scene from './scenes/LevelScenes/Level7.scene';
import Level8Scene from './scenes/LevelScenes/Level8.scene';
import Level9Scene from './scenes/LevelScenes/Level9.scene';
import Level10Scene from './scenes/LevelScenes/Level10.scene';
import Level11Scene from './scenes/LevelScenes/Level11.scene';
import Level12Scene from './scenes/LevelScenes/Level12.scene';
import Level13Scene from './scenes/LevelScenes/Level13.scene';
import Level14Scene from './scenes/LevelScenes/Level14.scene';
import Level15Scene from './scenes/LevelScenes/Level15.scene';

const levelScenes = [Level1Scene, Level2Scene, Level3Scene, Level4Scene, Level5Scene, Level6Scene, Level7Scene, Level8Scene, Level9Scene, Level10Scene, Level11Scene, Level12Scene, Level13Scene, Level14Scene, Level15Scene]

const gameConfig: Phaser.Types.Core.GameConfig = {
    title: 'To die or Not today',
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.NONE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 1200,
        height: 800,
    },
    scene: [MenuScene, ...levelScenes],
    physics: {
        default: 'arcade',
        arcade: {
            debug: true,
        },
    },
    parent: 'game',
    backgroundColor: '#4587de',
    zoom: 1.1
};

export const game = new Phaser.Game(gameConfig);