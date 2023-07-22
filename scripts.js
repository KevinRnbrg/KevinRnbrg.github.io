gameContainer = document.getElementById("game-container");
gameCanvas = document.getElementById("game-canvas");

let playerSpaceship;
let playerBullet;

let enemyAlien;
let enemyBullet;

const enemyBullets = [];
let gameObjects = [];

let winCount = 0;
let loseCount = 0;

let score = 0;
let gamePause;
let gameStart;

let lastShotTime = 0;
const maxTimeBetweenShots = 2500;
let lastFrameTime = Date.now();

function startGame() {
    if (gameStart == true) {
        gameArea.stop();
        gameArea.clear();
    }
    gameArea.start();
    gameObjects = [];

    let randomDirection = Math.random() < 0.5 ? -1 : 1;

    playerSpaceship = new component(110, 50, "sprites/spaceship03.png", 350, 650, 0, true, "image");
    enemyAlien = new component(60, 60, "sprites/alien02.png", 350, 100, ((5 + score*0.75) * randomDirection), true, "image");
    playerBullet = new component(25, 25, "sprites/blueball.png", playerSpaceship.x, playerSpaceship.y, 0, true, "image");
    enemyBullet = new component(25, 25, "sprites/redball.png", enemyAlien.x, enemyAlien.y, 0, true, "image");

    gameObjects.push(playerSpaceship);
    gameObjects.push(enemyAlien);
    gameObjects.push(playerBullet);
    gameObjects.push(enemyBullet);
    
    enemyHitSound = new sound("sounds/enemyHit2.m4a");
    playerHitSound = new sound("sounds/spaceShipHit.m4a");
    enemyShootSound = new sound("sounds/enemyShoot2.m4a");
    shipShootSound = new sound("sounds/shipShoot.m4a");
}
    
let gameArea = {
    canvas : document.getElementById("game-canvas"),
    start : function () {
        gamePause = false;
        gameStart = true;
        this.canvas.width = 800;
        this.canvas.height = 750;
        //this.canvas.style.cursor = "none"; //hide original cursor
        this.context = this.canvas.getContext("2d");
        //document.body.insertBefore(this.canvas, document.body.childNodes[0]);
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
        gamePause = true;
    }
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
        let index = gameObjects.indexOf(this);
        if (index !== -1) {
            gameObjects.splice(index, 1);
        }
        this.x = -100;
        this.y = -100;

        this.alive = false;
    }
    this.updatePattern = function () { // enemy move pattern
        this.x += this.speedX;
        if (this.x >= 650) {
            this.speedX = (5 + score*0.75) * -1;
        } else if (this.x <= 50) {
            this.speedX = (5 + score*0.75);
        }
    }
    this.newPos = function() {
        this.x += this.speedX;
        this.y += this.speedY;
    }
}

function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    this.play = function() {
        this.sound.play();
    }
    this.stop = function() {
        this.sound.pause();
    }
}

document.addEventListener('keydown', function(event) { // space key disabled to stop scroll on page
    if (event.code === 'Space' || event.code === 'ArrowUp' || event.code === 'ArrowDown' || event.code === 'ArrowLeft' || event.code === 'ArrowRight') {
      event.preventDefault();
    }
});

function stopGame() {
    gameArea.context.font = " bold 30px 'Courier New', monospace";
    gameArea.context.textAlign = "center";
    gameArea.context.fillStyle = "Orange";
    gameArea.context.fillText("Paused", gameArea.canvas.width/2, 330);
    if (gamePause == false) {
        gameArea.stop();
    } else if (gamePause == true) {
        gameArea.start();
    }
}

function startGameBtn() {
    clearGame()
    startGame()
}

function clearGame() {
    winCount = 0;
    loseCount = 0;
    score = 0;
}

gameContainer.appendChild(gameCanvas);

function playerWin() {
    winCount += 1;
    score += 1;
} 

function playerLose() {
    loseCount += 1;
    score -= 1;
}

function checkCollision(subject, target) {
    if (subject.x < target.x + target.width && 
        subject.x + subject.width > target.x && 
        subject.y < target.y + target.height && 
        subject.y + subject.height > target.y) {
        return true;
    } else { return false; }
}

//the function should be remade for consistency
function updateShootPattern() { // random number from 1-200
    random = Math.random();
    randomNumber = random * 200;
    return randomNumber;
}

function restart() { // restart game
    if (!playerSpaceship.alive && enemyAlien.alive) {
        playerLose();
    } else if (playerSpaceship.alive && !enemyAlien.alive) {
        playerWin();
    }
    gameArea.stop();
    gameArea.clear();
    gameObjects = [];
    startGame();
}

function displayPlayerRecord() { // show player record
    gameArea.context.font = "bold 30px 'Courier New', monospace";
    gameArea.context.textAlign = 'left';
    gameArea.context.fillStyle = "cyan";
    if (score < 0) {
        score = 0;
    }
    /* gameArea.context.fillText("Wins: " + winCount, 30, 50);
    gameArea.context.fillText("Losses: " + loseCount, 30, 85); */
    gameArea.context.fillText("Points: " + score, 30, 50);
}

function displayPlayerAndEnemyAttributes() {
    gameArea.context.font = "bold 30px 'Courier New', monospace";
    gameArea.context.textAlign = 'left';
    gameArea.context.fillStyle = "cyan";
    gameArea.context.fillText("Alien speed: " + (Math.abs(enemyAlien.speedX)), 30, 85);
    //gameArea.context.fillText("Spaceship bullet speed: " + playerBullet.speedY, 30, 110);
}

function displayEndScreen() {    // 'You win', 'Your lose' and 'Draw' texts
    centerX = gameArea.canvas.width/2;
    centerY = gameArea.canvas.height/2;
    const rectWidth = 400;
    const rectHeight = 150;
    rectX = centerX - rectWidth / 2; 
    rectY = centerY - rectHeight / 2;

    gameArea.context.font = " bold 30px 'Courier New', monospace";
    gameArea.context.textAlign = 'center';
    if (!enemyAlien.alive || !playerSpaceship.alive) {
        gameArea.context.fillStyle = "Gray";
        gameArea.context.fillRect(rectX, rectY, rectWidth, rectHeight)
        gameArea.context.strokeStyle = "Cyan";
        gameArea.context.lineWidth = 10;
        gameArea.context.strokeRect(rectX, rectY, rectWidth, rectHeight);
        gameArea.context.fillStyle = "Cyan";
        gameArea.context.fillText("Press R to restart", centerX, 410);
    }
    if (!playerSpaceship.alive && enemyAlien.alive) {
        gameArea.context.fillStyle = "#FF3131";
        gameArea.context.fillText("You lose", centerX, 360);
    }
    if (!enemyAlien.alive && playerSpaceship.alive) {
        gameArea.context.fillStyle = "#0FFF50";
        gameArea.context.fillText("You win", centerX, 360);
    }
    if (!enemyAlien.alive && !playerSpaceship.alive) {
        gameArea.context.fillStyle = "Orange";
        gameArea.context.fillText("Draw", centerX, 360);
    }
}

function stopObjectAtEdge(object) {
    if (object.x > 650) {
        if (gameArea.keys[39] || gameArea.keys[68]){
            object.speedX = 0;
        }
    }
    if (object.x < 40) {
        if (gameArea.keys[37] || gameArea.keys[65]){
            object.speedX = 0;
        }
    }
    if (object.y > 650) {
        if (gameArea.keys[40] || gameArea.keys[83]){
            object.speedY = 0;
        }
    }
    if (object.y < 500) {
        if (gameArea.keys[38] || gameArea.keys[87]){
            object.speedY = 0;
        }
    }
}

function playerMovementControls() {
    // playerSpaceship stops after release of movement button
    playerSpaceship.speedX = 0;
    playerSpaceship.speedY = 0;

    // arrowkeys movement
    if (gameArea.keys && gameArea.keys[37]) {playerSpaceship.speedX = -10; }
    if (gameArea.keys && gameArea.keys[39]) {playerSpaceship.speedX = 10; }
    if (gameArea.keys && gameArea.keys[38]) {playerSpaceship.speedY = -10; }
    if (gameArea.keys && gameArea.keys[40]) {playerSpaceship.speedY = 10; }

    // WASD movement
    if (gameArea.keys && gameArea.keys[65]) {playerSpaceship.speedX = -10; }
    if (gameArea.keys && gameArea.keys[68]) {playerSpaceship.speedX = 10; }
    if (gameArea.keys && gameArea.keys[87]) {playerSpaceship.speedY = -10; }
    if (gameArea.keys && gameArea.keys[83]) {playerSpaceship.speedY = 10; }
}

function playerBulletMechanics() {
    if (gameArea.keys && gameArea.keys[32]) {
        if (playerBullet.speedY == 0) { // if bullet is with ship and space pressed
            shipShootSound.play();
        }
        if (score >= 10) { // bullet faster when score >= 10
            playerBullet.speedY = -20;
        } else {
            playerBullet.speedY = -15; 
        }
    } else if (playerBullet.y <= 0 || playerBullet.speedY == 0) {
            playerBullet.speedY = 0;
            playerBullet.x = playerSpaceship.x + 40;
            playerBullet.y = playerSpaceship.y - 30;
    }  
}

function enemyBulletMechanics() {
    // enemy bullet stay with enemy, shoot once in a while
    if (enemyAlien.alive) {
        shootTime = maxTimeBetweenShots - (50*score)
        if (lastShotTime > shootTime) {
            lastShotTime = 0;
            enemyBullet.speedY = 18;
            enemyShootSound.play();
        }
        else if (enemyBullet.y >= 750 || enemyBullet.speedY == 0) {
            enemyBullet.speedY = 0;
            enemyBullet.x = enemyAlien.x + 20;
            enemyBullet.y = enemyAlien.y + 65;
        }
    } else { return; }
}

function calculateLastEnemyShot() {
    const now = Date.now();
    const deltaTime = now - lastFrameTime;
    lastFrameTime = now;
    lastShotTime += deltaTime;
}

function updateGameArea() {
    gameArea.clear();

    displayPlayerAndEnemyAttributes();
    displayPlayerRecord();
    playerMovementControls();
    enemyBulletMechanics();
    playerBulletMechanics();
    calculateLastEnemyShot();
    stopObjectAtEdge(playerSpaceship);

    // restart game with 'R'
    if (gameArea.keys && gameArea.keys[82]) { // can hold, should be on button up or smth like that
        restart();
    }
    
    for (let i = 0; i < gameObjects.length; i++) {
        let gameObject = gameObjects[i];

        if (gameObject == enemyAlien) {
            gameObject.updatePattern();
        } else {
            gameObject.newPos();
        }
        gameObject.update();
    }

    displayEndScreen();

    if (checkCollision(playerSpaceship, enemyBullet)) {
        if (playerSpaceship.alive) {
            playerHitSound.play();
        }
        playerSpaceship.kill();
        playerBullet.kill();
    }
    if (checkCollision(enemyAlien, playerBullet)) {
        if (enemyAlien.alive) {
            enemyHitSound.play();
        }
        enemyAlien.kill();
        enemyBullet.kill();
    }
}