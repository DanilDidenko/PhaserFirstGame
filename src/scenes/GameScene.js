let hero;
let platforms;


let direction = 'right';

let inAir = false;
let onGround = false;
let onWall = false;

let isJumped = false;
let isDashing = false;
let isRunning = false;
let isWallJumped = false;


let dashReady = true;
let dashEnergy = 15;

let wallJumpInertion = 10;

let gravity = 0;




let walside = 'right';

export default class GameScene extends Phaser.Scene {
    constructor() {
        super('Game');
    }


    preload() {
        this.load.image('logo', 'assets/logo.png');
        this.load.image('ground', 'assets/platform.png');
        this.load.spritesheet('hero', 'assets/hero.png', {
            frameWidth: 50,
            frameHeight: 37

        });

        this.load.image('sky', 'assets/sky.png');

    }



    create() {


        this.add.image(400, 300, 'sky');


        platforms = this.physics.add.staticGroup()
        platforms.create(200, 400, 'ground').setScale(2, 1).refreshBody();
        platforms.create(100, 300, 'ground').setScale(0.5, 0.5).refreshBody();
        platforms.create(590, 300, 'ground').setScale(0.1, 30).refreshBody();



        this.cursors = this.input.keyboard.createCursorKeys();

        hero = this.physics.add.sprite(20, 350, 'hero', 0);
        hero.body.setSize(20, 30, 50, 25);
        hero.setCollideWorldBounds(true);

        this.physics.add.collider(hero, platforms);
        console.log(hero)


        this.anims.create({
            key: 'run',
            frameRate: 8,
            frames: this.anims.generateFrameNames('hero', { start: 8, end: 12 })
        })
        this.anims.create({
            key: 'stand',
            frameRate: 8,
            frames: this.anims.generateFrameNames('hero', { start: 0, end: 3 })
        })
        this.anims.create({
            key: 'shift',
            frameRate: 8,
            frames: this.anims.generateFrameNames('hero', { start: 24, end: 27 })
        })
        this.anims.create({
            key: 'all',
            frameRate: 3,
            frames: this.anims.generateFrameNames('hero', { start: 0, end: 200 })
        })
        this.anims.create({
            key: 'jump',
            frameRate: 8,
            frames: this.anims.generateFrameNames('hero', { start: 14, end: 16 })
        })
        this.anims.create({
            key: 'climb',
            frameRate: 3,
            frames: this.anims.generateFrameNames('hero', { start: 32, end: 40 })
        })
        this.anims.create({
            key: 'dash',
            frameRate: 20,
            frames: this.anims.generateFrameNames('hero', { start: 16, end: 22 })
        })


    }

    update() {

        //SET POSITION
        if (hero.body.touching.down) {
            inAir = false;
            onWall = false;
            onGround = true;
            if (dashEnergy === 0) {
                dashEnergy = 15;
            }
            if (this.cursors.space.isUp && isJumped) {
                isJumped = false;
            }
            dashReady = true;

            if (gravity != 300) {
                gravity = 300;
                hero.setGravityY(gravity);
            }
        } else if (!hero.body.touching.down && (hero.body.wasTouching.left || hero.body.wasTouching.right)) {
            inAir = false;
            onWall = true;
            onGround = false;
            if (gravity != -300) {
                gravity = -300;
                hero.setGravityY(gravity);
            }
            hero.setVelocityX(0);
            hero.setVelocityY(0);
            wallJumpInertion = 10;
        } else if (!hero.body.touching.down && !hero.body.wasTouching.left && !hero.body.wasTouching.right) {
            inAir = true;
            onWall = false;
            onGround = false;

            if (gravity != 300) {
                gravity = 300;
                hero.setGravityY(gravity);
            }
        }
        
        //SET ACTIONS
        if (onGround) {
            if (this.cursors.left.isDown || this.cursors.right.isDown) {
                isRunning = true;
            } else {
                isRunning = false;
            }
            isDashing = false;
            isWallJumped = false;
        } else if (inAir) {
            isRunning = false;
        } else if (onWall) {
            isWallJumped = false;
        }



        //SET DIRECTION
        if (this.cursors.right.isDown && !isDashing && !onWall) {
            direction = 'right';
            hero.setFlipX(false);

        } else if (this.cursors.left.isDown && !isDashing && !onWall) {
            direction = 'left';
            hero.setFlipX(true);
        }

        //<<<<<<<<<<<<<<<<<ONGROUND ACTIONS>>>>>>>>>>>>>>//
        //STAND
        if (onGround) {
            //STANDING
            if (!isRunning) {
                hero.setVelocityX(0);
                hero.play('stand', true);
            }

            //RUNNING
            if (isRunning) {
                if (direction === 'right') {
                    hero.setVelocityX(160)
                } else if (direction === 'left') {
                    hero.setVelocityX(-160)
                }
                hero.play('run', true)
            }
            //JUMP
            if (this.cursors.space.isDown && !isJumped) {
                hero.setVelocityY(-330);
                hero.play('jump', true);
                isJumped = true;
            }
        }


        //<<<<<<<<<<<<<<<<<<<<<<<<< IN AIR ACTION>>>>>>>>>>>>>>>

        // AIR VELOCITY
        if (inAir && !isWallJumped) {
            if (this.cursors.right.isDown && !isDashing) {
                hero.setVelocityX(160)
            } else if (this.cursors.left.isDown && !isDashing) {
                hero.setVelocityX(-160)
            }

            if (this.cursors.shift.isDown && dashReady) {
                isDashing = true;
                dashReady = false;
            }

            if (isDashing) {
                if (dashEnergy > 0) {
                    hero.play('dash', true)
                    hero.setVelocityY(-dashEnergy * 5);
                    dashEnergy--
                    if (direction === 'right') {
                        hero.setVelocityX(400);
                    } else if (direction === 'left') {
                        hero.setVelocityX(-400);
                    }
                } else {
                    isDashing = false;
                    if (direction === 'right') {
                        hero.setVelocityX(100);
                    } else if (direction === 'left') {
                        hero.setVelocityX(-100);
                    }
                }
            }
        }

        // <<<<<<<<<<<<<< ONWALL ACTIONS>>>>>>>>>>>>>>
        if (onWall) {

            if (!isWallJumped && wallJumpInertion === 15 && this.cursors.space.isDown) {
                isWallJumped = true
            }

            if (isWallJumped && wallJumpInertion > 0) {
                if (direction === 'right') {
                    hero.setVelocityX(-wallJumpInertion*20 +30)
                }else if(direction === 'left'){
                    hero.setVelocityX(300)
                }
                wallJumpInertion--
            }

            if (isWallJumped && wallJumpInertion <= 0){
                isWallJumped = false
            }


        }










    }

}

