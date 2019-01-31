/** @type {import("../../typings/phaser*/

let hero;
let platforms;


let direction = 'right';

let inAir = false;
let onGround = false;
let onWall = false;
let position;


let isJumped = false;
let isDashing = false;
let isRunning = false;
let isWallJumped = false;


let dashReady = true;
let dashEnergy = 15;
let dashColdown = 100;



let attacking = false;
let attackAnimationStated = false;
let justAttacked = false;

let combo = 1;
let maxCombo = 3;


let timeToComboAttack = 0;


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
        this.load.spritesheet('hero', 'assets/hero2.png', {
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

        this.x = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X);
        this.cursors = this.input.keyboard.createCursorKeys();

        hero = this.physics.add.sprite(20, 350, 'hero', 0);
        hero.body.setSize(20, 30, 50, 25);
        hero.setCollideWorldBounds(true);
        hero.setGravityY(300)

        this.physics.add.collider(hero, platforms);

        console.log(hero)
        this.anims.create({
            key: 'run',
            frameRate: 8,
            frames: this.anims.generateFrameNames('hero', { start: 8, end: 13 })
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
            frameRate: 20,
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
        this.anims.create({
            key: 'attack-1',
            frameRate: 9,
            frames: this.anims.generateFrameNames('hero', { start: 42, end: 49 })
            //42-49
        })
        this.anims.create({
            key: 'attack-2',
            frameRate: 9,
            frames: this.anims.generateFrameNames('hero', { start: 50, end: 53 })
            //42-49
        })
        this.anims.create({
            key: 'attack-3',
            frameRate: 9,
            frames: this.anims.generateFrameNames('hero', { start: 54, end: 59 })
            //42-49
        })
        this.anims.create({
            key: 'falling',
            frameRate: 3,
            frames: this.anims.generateFrameNames('hero', { start: 79, end: 80 })
            //42-49
        })


    }

    update() {



        if (justAttacked && timeToComboAttack > 0) {
            timeToComboAttack--;
        } else if (justAttacked && timeToComboAttack <= 0) {
            combo= 1;
            justAttacked = false;
            timeToComboAttack = 50;
        }



        //SET POSITION
        if (hero.body.touching.down && position != 'ground') {
            position = 'ground';
            console.log('onground');
            dashReady =true;
            dashEnergy = 15;
            hero.setGravityY(300)
            if (this.cursors.space.isUp) {
                isJumped = false;
            }
        } else if (!hero.body.touching.down && !hero.body.wasTouching.left && !hero.body.wasTouching.right && position != 'wall' && position != 'air') {
            position = 'air';
            console.log('inair')
        } else if (!hero.body.touching.down && (hero.body.wasTouching.left || hero.body.wasTouching.right) && position != 'wall') {
            if (position != 'wall') position = 'wall';
            
            hero.setVelocityY(40);
            hero.setGravityY(-300)
            console.log(hero.gravity);
            wallJumpInertion = 10;
        }
        //SET DIRECTION
        if (!isDashing && !onWall && !attacking) {
            if (this.cursors.right.isDown && hero.flipX) {
                direction = 'right';
                hero.setFlipX(false);
            } else if (this.cursors.left.isDown && !hero.flipX) {
                direction = 'left';
                hero.setFlipX(true);
            }
        }


        if (position === 'ground') {

            //STANDING
            if (!(this.cursors.right.isDown || this.cursors.left.isDown) && !attacking && !isJumped) {
                hero.setVelocityX(0);
                hero.play('stand', true);
            }
            //RUNNING
            if (!attacking && !isJumped && (this.cursors.right.isDown || this.cursors.left.isDown)) {

                if (direction === 'right') {
                    hero.setVelocityX(160)
                } else if (direction === 'left') {
                    hero.setVelocityX(-160)
                }
                hero.play('run', true);
            }
            //JUMP
            if (this.cursors.space.isDown && !isJumped && !attacking) {
                isJumped = true;
                hero.play('jump', true);

            }
            else if (isJumped) {
                if (hero.anims.currentAnim.key === 'jump' && hero.anims.currentFrame.isLast) {
                    hero.setVelocityY(-330);
                }
            }


            //ATTACK
            if (this.x._justDown && !attacking) {
                attacking = true;
                hero.setVelocityX(0)
                console.log('atttttttttttttttac')
            }
            if (attacking) {

                
                if (hero.anims.currentAnim.key.split('-')[0] != 'attack' && !attackAnimationStated) {
                    hero.play('attack-2', true);
                    console.log('attack')
                    attackAnimationStated = true;
            
                } else if (attackAnimationStated) {
                    if (hero.anims.currentFrame.isLast) {
                        attackAnimationStated = false;
                        attacking = false;
                        justAttacked = true;
                   

                    }
                }

            }


        }


        //<<<<<<<<<<<<<<<<<<<<<<<<< IN AIR ACTION>>>>>>>>>>>>>>>

        // AIR VELOCITY
        if (position === 'air' && !isWallJumped) {

            if (hero.body.velocity.y > 0) {
                hero.play('falling', true)
            }

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
        if (position === 'wall') {

            // if (hero.body.wasTouching.left || hero.body.wasTouching.right) {
            //     hero.setVelocityY(0)
            //     hero.setGravityY(-300);
            //     console.log('3ef')
            // } else {
            //     hero.setGravityY(300);
            // }

            if (!isWallJumped && wallJumpInertion === 15 && this.cursors.space.isDown) {
                isWallJumped = true
            }

            if (isWallJumped && wallJumpInertion > 0) {
                if (direction === 'right') {
                    hero.setVelocityX(-wallJumpInertion * 20 + 30)
                } else if (direction === 'left') {
                    hero.setVelocityX(300)
                }
                wallJumpInertion--
            }

            if (isWallJumped && wallJumpInertion <= 0) {
                isWallJumped = false
            }


        }










    }

}

