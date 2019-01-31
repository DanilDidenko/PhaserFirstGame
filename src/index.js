import 'phaser';

import config from './config/config';
import GameScene from './scenes/GameScene';

/** @type {import("../typings/phaser")}  */

class Game extends Phaser.Game {
    constructor(){
        super(config);
        this.scene.add('Game', GameScene);
        this.scene.start('Game');
        console.log(this)
        
    }
    
 }


 window.onload = function () {
     
     window.game = new Game();
 }