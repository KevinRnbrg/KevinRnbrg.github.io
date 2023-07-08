let spaceShip;
let greenEnemy;
let shipBullet;
let enemyBullet;
let randomSpeed;

let winCount = 0;
let loseCount = 0;

function startGame() {
    gameArea.start();

    randomSpeed = Math.floor(Math.random() * 20) + 5; // speed is random number from 5...20

    spaceShip = new component(110, 50, "spaceship021.png", 350, 650, 0, true, "image");
    greenEnemy = new component(60, 60, "green", 350, 100, randomSpeed, true), "color";
    shipBullet = new component(25, 25, "blue", spaceShip.x, spaceShip.y, 0, true, "color");
    enemyBullet = new component(25, 25, "red", greenEnemy.x, greenEnemy.y, 0, true, "color");
    
}

document.addEventListener('keydown', function(event) { // space key disabled to stop scroll on page
    if (event.code === 'Space' || event.code === 'ArrowUp' || event.code === 'ArrowDown' || event.code === 'ArrowLeft' || event.code === 'ArrowRight') {
      event.preventDefault();
    }
});
    
let gameArea = {
    canvas : document.createElement("canvas"),
    start : function () {
        this.canvas.width = 800;
        this.canvas.height = 750;
        //this.canvas.style.cursor = "none"; //hide original cursor
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.interval = setInterval(updateGameArea, 20);

        window.addEventListener('keydown', function (e) {
            gameArea.keys = (gameArea.keys || []);
            gameArea.keys[e.keyCode] = true;
        })
        window.addEventListener('keyup', function (e) {
            gameArea.keys[e.keyCode] = false;
        })
    },
    clear : function() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    stop : function() {
        clearInterval(this.interval);
    }
}

function playerWin() {
    winCount += 1;
} 

function playerLose() { // doesnt work as intended
    loseCount =+ 1;
}

function component(width, height, color, x, y, speed, alive, type) {
    this.type = type;
    if (type == "image") {
        this.image = new Image();
        this.image.src = color;
    }
    this.width = width;
    this.height = height;
    this.color = color;
    this.speedX = speed;
    this.alive = alive;
    this.speedY = 0;
    this.x = x;
    this.y = y;
    this.update = function () {
        if (!this.alive) {
            return;
        } else {
            ctx = gameArea.context;
            if (type == "image") {
                ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
            } else {
                ctx.fillStyle = color;
                ctx.fillRect(this.x, this.y, this.width, this.height);
            }
            
        }
    }
    this.kill = function () {
        /* let index = component.indexOf(this);
        component.splice(index, 1); */

        ctx = gameArea.context;
        ctx.clearRect(this.x, this.y, this.width, this.height);
        this.alive = false;
    }
    this.updatePattern = function () { // enemy move pattern
        this.x += this.speedX;
        if (this.x >= 650) {
            this.speedX = randomSpeed * -1;
        } else if (this.x <= 50) {
            this.speedX = randomSpeed;
        }
    }
    this.newPos = function() {
        this.x += this.speedX;
        this.y += this.speedY;
    }
}

function checkCollision() {
    if (greenEnemy.x < shipBullet.x + shipBullet.width && greenEnemy.x + greenEnemy.width > shipBullet.x && greenEnemy.y < shipBullet.y + shipBullet.height && greenEnemy.y + greenEnemy.height > shipBullet.y) {
        return true;
    } else { return false; }
}

function checkShipCollision() {
    if (spaceShip.x < enemyBullet.x + enemyBullet.width && spaceShip.x + spaceShip.width > enemyBullet.x && spaceShip.y < enemyBullet.y + enemyBullet.height && spaceShip.y + spaceShip.height > enemyBullet.y) {
        return true;
    } else { return false; }
}

function updateShootPattern() {
    random = Math.random();
    randomNumber = random * 200; // random number from 1-200
    return randomNumber;
}

function restart() { // restart game
    if (!spaceShip.alive && greenEnemy.alive) {
        //playerLose();
        loseCount += 1;
    } else if (spaceShip.alive && !greenEnemy.alive) {
        playerWin();
    }
    gameArea.stop();
    gameArea.clear();
    startGame();
}

function updateGameArea() {
    gameArea.clear();

    // show player record
    gameArea.context.font = "30px Arial";
    gameArea.context.fillText("Wins: " + winCount, 30, 50);
    gameArea.context.fillText("Losses: " + loseCount, 30, 85);
    
    // spaceship stops after release of movement button
    spaceShip.speedX = 0;
    spaceShip.speedY = 0;

    // arrowkeys movement
    if (gameArea.keys && gameArea.keys[37]) {spaceShip.speedX = -10; }
    if (gameArea.keys && gameArea.keys[39]) {spaceShip.speedX = 10; }
    if (gameArea.keys && gameArea.keys[38]) {spaceShip.speedY = -10; }
    if (gameArea.keys && gameArea.keys[40]) {spaceShip.speedY = 10; }

    // WASD movement
    if (gameArea.keys && gameArea.keys[65]) {spaceShip.speedX = -10; }
    if (gameArea.keys && gameArea.keys[68]) {spaceShip.speedX = 10; }
    if (gameArea.keys && gameArea.keys[87]) {spaceShip.speedY = -10; }
    if (gameArea.keys && gameArea.keys[83]) {spaceShip.speedY = 10; }

    // restart game with 'R'
    if (gameArea.keys && gameArea.keys[82]) {
        restart(); 
    }
    
    if (gameArea.x && gameArea.y) {
        spaceShip.x = gameArea.x;
        spaceShip.y = gameArea.y;
    }

    // check if object is near edge and stop it
    if (spaceShip.x > 650) {
        if (gameArea.keys[39] || gameArea.keys[68]){
            spaceShip.speedX = 0;
        }
    }
    if (spaceShip.x < 40) {
        if (gameArea.keys[37] || gameArea.keys[65]){
            spaceShip.speedX = 0;
        }
    }
    if (spaceShip.y > 650) {
        if (gameArea.keys[40] || gameArea.keys[83]){
            spaceShip.speedY = 0;
        }
    }
    if (spaceShip.y < 500) {
        if (gameArea.keys[38] || gameArea.keys[87]){
            spaceShip.speedY = 0;
        }
    }

    // stop enemy object if it is near border

        if (greenEnemy.x > 800) {
        greenEnemy.speedX = 0;
    }
    if (greenEnemy.x < 0) {
        greenEnemy.speedX = 0;
    }

    // ship bullet move when space pressed, otherwise stay with ship
    if (gameArea.keys && gameArea.keys[32]) {
        shipBullet.speedY = -15; 
    } else if (shipBullet.y <= 0 || shipBullet.speedY == 0) {
            shipBullet.speedY = 0;
            shipBullet.x = spaceShip.x + 40;
            shipBullet.y = spaceShip.y - 30;
    }  

    // enemy bullet stay with enemy, shoot once in a while
    if (updateShootPattern() > 190)  {
        enemyBullet.speedY = 18;
    } else if (enemyBullet.y >= 750 || enemyBullet.speedY == 0) {
        enemyBullet.speedY = 0;
        enemyBullet.x = greenEnemy.x + 20;
        enemyBullet.y = greenEnemy.y + 65;
    }

    // write 'You win' when enemy is dead and 'Your lose' when space ship is dead and draw when both die
    if (!spaceShip.alive && greenEnemy.alive) {
        gameArea.context.fillStyle = "Red";
        gameArea.context.font = "30px Arial";
        gameArea.context.fillText("You lose, press R to restart", 210, 375);
    }
    if (!greenEnemy.alive && spaceShip.alive) {
        gameArea.context.fillStyle = "Green";
        gameArea.context.font = "30px Arial";
        gameArea.context.fillText("You win, press R to restart", 210, 375);
    }
    if (!greenEnemy.alive && !spaceShip.alive) {
        gameArea.context.fillStyle = "Orange";
        gameArea.context.font = "30px Arial";
        gameArea.context.fillText("Draw, press R to restart", 210, 375);
    }
    
    spaceShip.newPos();
    if (checkShipCollision() || spaceShip.alive == false) { // if ship collided with enemy bullet then die
        spaceShip.kill();
        shipBullet.kill();
    } else { 
        spaceShip.update();
        shipBullet.newPos();
        shipBullet.update();
    }

    greenEnemy.updatePattern();
    if (checkCollision() || greenEnemy.alive == false) { // if enemy has collided with ship bullet then die
        greenEnemy.kill();
        enemyBullet.kill();
    } else {
        greenEnemy.update();
        enemyBullet.newPos();
        enemyBullet.update();
    }
}

