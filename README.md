# Wowie Jam 3.0

## Table of contents


* [Clone the project](#clone-the-project)
  * [SSH](#ssh)
  * [HTTPS](#https)
* [Startup the game](#startup-the-game)
  * [Install dependencies](#install-dependencies)
  * [Startup the game in dev mode](#startup-the-game-in-dev-mode)
  * [Build the game](#build-the-game)
* [Work on the project](#work-on-the-project)
  * [Project tree](#project-tree)
  * [Create a new class](#create-a-new-class)
  * [Create a new scene](#create-a-new-scene)

## Clone the project

### SSH

```bash
git clone git@github.com:DreamTeckk/Wowie-Jam-3.0.git
```

### HTTPS

```bash
git clone https://github.com/DreamTeckk/Wowie-Jam-3.0.git
```

## Startup the game

### Install dependencies

**If you have just cloned the project and never started it up**, you'll firstly have to intall the dependencies : 

```bash
npm install
```

### Startup the game in dev mode

```bash
npm run dev
```

This will create a temporary dist folder where the compiled typescript files will be read to display the game.
The project provides a file watcher to automaticaly reload the project whene a file save is detected.
You can now access the game in your browser at http://localhost:8081/.

### Build the game

```bash
npm run build
```

This will build the project in the default ```dist``` folder at the root of the project.

## Work on the project

### Project tree

```text
.
├── assets                  # Media files used in the game (all the assets have to be provides as 'assets/**' in .ts files)
|   ├── images              # All image files (does not includes spritesheet images!)
|   ├── sounds              # All the sound files
|   └── spritesheets        # All the game spritesheet images for animation.
├── dist                    # Compiled files
├── node_modules            # Modules used by the game
|   └── ... 
├── src                     # Source files
|   ├── classes             
|   ├── enums               
|   ├── factories           # Factoriy class used to contains game object logic (e.g.: Ennemies factory)
|   ├── helpers             # Helping files such as Objects, Functions, etc.. (e.g.: Items price object) 
|   ├── scenes
|   └── game.ts             # Main game logic.
├── .eslintrc.json          # ESLint file for code quality
├── .gitignore
├── .prettier.json          # Code visibily rules 
├── package.lock.json
├── package.json
├── LICENSE
├── README.md
├── tsconfig.json
└── webpack.config.js
```

### Create a new class

Here's a code sample of a class's base :

```typescript
import { Scene } from 'phaser';

/**
 * Here we create a Player class that is represented by a Phaser Container in the game Scene.
 * Phaser Containers acts as GameObjects group. It is usefull for manipulate multiple GameObjects at once, 
 * like for moving theme at a same position and a same speed without doing it for every GameObject of the group.
 */
export default class Player extends Phaser.GameObjects.Container {

    private _health: number;
    private _speed: number;
    private _dmgPoint: number;
    private _isAlive: boolean;

    contsructor(x: number, y: number, dmgPoint: number, scene: Scene) {
        super(scene, x, y) // Registering the GameObject of the Player in the provided Scene with it's 2D position.

        this._health = 100;
        this._speed = 10;
        this._dmgPoint = dmgPoint;
        this._isAlive = true
    }

    // Health getter & setter

    get health(): number {
        return this._health;
    }

    set health(value: number) {
        this._health = value;
    }

    // Speed getter and setter
    //...

    // Damage Points getter and setter
    //...

    // Is Alive getter and setter
    //...

    public create(): void {
        /**
         * The function called in the Game or Factory create() method.
         * 
         * Here are initialized all the assets, animations, and visual or sound dependencies of the Player
         */ 
    }  

    public update(): void {
        /**
         * The function called in the Game or Factory update() method.
         * 
         * Here are all the Player visual, sound or parameters update that should be applied 
         * every time the Game Canvas update.
         * 
         * A simple expemple is the Player's position update : 
         * - every update we check if a direction key is pressed.
         * - if it's true, we update the x and y position of the Player depending on his speed.
         * 
         * TIPS : Phaser automatically update animations with spritesheets when created.
         */ 
    }
}
```

### Create a new scene

Here's a code sample of a scene's base :

```typescript

const config: Phaser.Types.Scenes.SettingsConfig = {
    key: 'myScene', // The key to provide to Phaser whene you want to change scene to this one
    visible: false, 
    active: false // Defines if the Scene is active or not.
}

import { Scene } from 'phaser';


export default class MyScene extends Phaser.Scene {
    
    constructor() {
        super(config)
    }

    public preload(): void {
        /**
         *  The preload() method is used to load all the assets before the game starts.
         *  It's used to prevent the game to start with missing or unload images, spritesheets, etc.. 
         */
    }

    public create(): void {
        /**
         * The create() method is called after the preload() method has finished loading all the assets.
         * Here we can call the create() methods of our others Classes and add the logic to setup the 
         * decorations of our Scene.   
         */
    }

    /**
     * @param {number} time The current time. Either a High Resolution Timer value if it comes 
     * from Request Animation Frame, or Date.now if using SetTimeout.
     * @param {number} delta The delta time in ms since the last frame. 
     * This is a smoothed and capped value based on the FPS rate.
     */
    public update(time: number, delta: number): void {
        /**
         * The update() method is called every frame while the scene is active. 
         * It should containes your classes update() method and the update of your scene.
         */
    }
}
```
