const GAMESTATE = {
    PAUSED: 0,
    RUNNING: 1
}


class Game {
    constructor (gameWidth, gameHeight) {
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
    }

    start () {
        
        this.gameState = GAMESTATE.PAUSED;

        this.paddle = new Paddle(this);
        this.ball = new Ball(this);

        let bricks = buildLevel(this, level1);

        this.gameObjects = [this.ball, this.paddle, ...bricks];

        new InputHandeler(this.paddle, this);

    }

    update (deltaTime) {

        if (this.gameState == GAMESTATE.PAUSED) return;

        this.gameObjects.forEach(object => object.update(deltaTime));
        this.gameObjects = this.gameObjects.filter(object => !object.markedForDeletion);
    }

    draw (ctx) {
        this.gameObjects.forEach(object => object.draw(ctx));
    } 

    togglePause () {
        
        if (this.gameState == GAMESTATE.PAUSED && this.gameObjects[0].position.x + this.gameObjects[0].size < GAME_HEIGHT) {
            this.gameState = GAMESTATE.RUNNING;
        } 

    }

}

class Paddle {

    constructor (game) {
        this.gameWidth = game.gameWidth;
        this.width = 150;
        this.height = 20;
        this.maxSpeed = 7;
        this.speed = 0;

        this.position = {
            x: game.gameWidth / 2 - this.width / 2,
            y: game.gameHeight - this.height - 10
        }
    }

    moveLeft () {
        this.speed = -this.maxSpeed;
    }

    moveRight () {
        this.speed = this.maxSpeed;
    }

    stop () {
        this.speed = 0;
    }

    draw (ctx) {
        ctx.fillStyle = '#0ff';
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    }

    update () {
                       
        this.position.x += this.speed;

        if (this.position.x < 0) {
            this.position.x = 0;
        }

        if (this.position.x + this.width > this.gameWidth) {
            this.position.x = this.gameWidth - this.width;
        }

    }

}

class InputHandeler {

    constructor (paddle, game) {
        document.addEventListener('keydown', (event) => {

            if (event.keyCode == 37) {
                paddle.moveLeft();
            } else if (event.keyCode == 39) {
                paddle.moveRight();
            } else if (event.keyCode == 32) {
                game.togglePause();
            }

        });

        document.addEventListener('keyup', (event) => {
            
            if (event.keyCode == 37) {
                paddle.stop();
            } else if (event.keyCode == 39) {
                paddle.stop();
            } 

        });
        
    }

}

class Ball {

    constructor (game) {
        this.image = document.getElementById('img_ball');
    
        this.speed = {x: 2, y: -6}; 

        this.size = 16;

        this.gameWidth = game.gameWidth;
        this.gameHeight = game.gameHeight;

        this.game = game;

        this.position = {x: game.gameWidth / 2 - this.size / 2, y: game.gameHeight - 50};

    }

    draw (ctx) {
        ctx.drawImage(this.image, this.position.x, this.position.y, this.size, this.size); // img, x, y, width, height
    }

    update () {
        
        this.position.x += this.speed.x;
        this.position.y += this.speed.y;

        if (this.position.x + this.size > this.gameWidth || this.position.x < 0) {
            this.speed.x = -this.speed.x;
        }
    
        if (this.position.y + this.size > this.gameHeight || this.position.y < 0) {
            this.speed.y = -this.speed.y;
        }

        if (detectCollision(this, this.game.paddle)) {
            this.speed.y = -this.speed.y;
            this.position.y = this.game.paddle.position.y - this.size;
        }

        if (this.position.y + this.size > GAME_HEIGHT) {
            game.gameState = GAMESTATE.PAUSED;
            this.size = 0;
            document.getElementsByClassName('again')[0].style.animation = "againAnimate 4s forwards";
            document.getElementsByClassName('over')[0].style.animation = "overAnimate 4s forwards";
            document.getElementsByClassName('game')[0].style.animation = "gameAnimate 4s forwards";
        }

    }

}

class Brick {

    constructor (game, position) {
        this.image = document.getElementById('img_brick');
    
        this.game = game;

        this.position = position;

        this.width = 80;
        this.height = 24;

        this.markedForDeletion = false;

    }

    update () {
        if (detectCollision(this.game.ball, this)) {
            this.game.ball.speed.y = -this.game.ball.speed.y;
            this.markedForDeletion = true;
        }
    }

    draw (ctx) {
        ctx.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
    }

}

const level1 = [
    [0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

function buildLevel (game, level) {
    let bricks = [];

    level.forEach((row, rowIndex) => {
        row.forEach((brick, brickIndex) => {
            if (brick === 1) {
                let position = {
                    x: 80 * brickIndex,
                    y: 24 * rowIndex
                }
                bricks.push(new Brick(game, position));
            }
        })
    })

    return bricks;

}

function detectCollision (ball, gameObject) {
 
    let bottomOfBall = ball.position.y + ball.size;
    let topOfBall = ball.position.y;
    
    let topOfObject = gameObject.position.y;
    let leftSideOfObject = gameObject.position.x;
    let rightSideOfObject = gameObject.position.x + gameObject.width;

    let bottomOfObject = gameObject.position.y + gameObject.height;

    if (bottomOfBall >= topOfObject && 
        ball.position.x >= leftSideOfObject && 
        ball.position.x + ball.size <= rightSideOfObject && 
        topOfBall <= bottomOfObject) {
        return true;
    } else {
        return false;
    }
    
}

let canvas = document.getElementById('gameScreen');
let ctx = canvas.getContext('2d');

const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;

let game = new Game(GAME_WIDTH, GAME_HEIGHT);
game.start();

let lastTime = 0;

function gameLoop (timestamp) {
    let deltaTime = timestamp - lastTime;
    lastTime = timestamp;

    ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    
    game.update(deltaTime);
    game.draw(ctx);
    
    requestAnimationFrame(gameLoop);

}

requestAnimationFrame(gameLoop);

function playAgainFunc () {
    location.reload();
}