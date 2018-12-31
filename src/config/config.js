export default{
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 600,
    height: 400,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {y: 300},
            debug: true
        }
    }
    
};