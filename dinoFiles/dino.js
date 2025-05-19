let canvas = document.getElementById("gameCanvas");
let ctx = canvas.getContext("2d"); 
let scoreboard = document.querySelector(".scoreboard");
let gameport = document.querySelector(".gameport")
let controls = document.querySelector(".controls")
let obstacle  = new Image(50,50);
obstacle.src = "graphics/desk.png"; // Path to your obstacle image
let dinogame = document.querySelector("#dino");
let isCorrect = false;
let frames = []; // Array to store loaded frames
let obstacleFrames = [];
let obs = [];
let player;
let players = [];
let playerUsernames = [];
let scoresArray = [];
let playerDeadCount = 0;
let playersPlayed = 0;
let collisionObs = 0;
let isRunning = false;
let animationFrameId = null;

function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min); // Include max in the range
}

function nameGenerator() {  
    let playerNames = document.querySelectorAll(".playerNames");
    playerNames.forEach((pn,index) => {
        if(pn.innerText != "No Name Selected"){
            let pName = pn.innerText;
            playerUsernames.push(pName);
        }
        else{
            playerUsernames.push(`Player ${index+1}`);
        }
    })
}

// Load frames into the array
for (let i = 0; i < 6; i++) {
    let obstacleFrame = new Image();
    if(i < 6){
        obstacleFrame.src = `graphics/latanie/latanie/${i}.png`; 
    }
    obstacleFrame.onload = () => {
        console.log(`Obstacle Frame ${i} loaded`);
    };
    obstacleFrames.push(obstacleFrame); // Add the frame to the array
}

// Load frames into the array
for (let i = 0; i < 7; i++) {
    let frame = new Image();
    if(i < 5){
        frame.src = `graphics/player/${i}.png`; 
    }
    else if(i==5){
        frame.src = `graphics/player/jump.png`; 

    }
    else if(i==6) {
        frame.src = `graphics/player/slide.png`
    }
    frame.onload = () => {
        console.log(`Frame ${i} loaded`);
    };
    frames.push(frame); // Add the frame to the array
}

class Obstacle {
    constructor(x, isFlying){
        this.x = x;
        if(isFlying) {
            this.y = 115;
        }
        else{
            this.y = 150;
        }
        this.speedX = 10;
        this.width = 50;
        this.height = 50;
        this.isFlying = isFlying;
        this.currentFrame = 0;
        this.animationSpeed = 100;
        this.lastFrameChange = 0;
        this.flyingY = 115;
    }

    draw() {
        if (this.isFlying == true) {
            this.y = this.flyingY
            if (obstacleFrames[this.currentFrame].complete && obstacleFrames[this.currentFrame].naturalHeight !== 0) {
                ctx.drawImage(obstacleFrames[this.currentFrame], this.x, this.y, this.width, this.height);
            } else {
                console.error("Flying obstacle frame not loaded yet.");
            }
        } 
        else {
            this.y = 150
            if (obstacle.complete && obstacle.naturalHeight !== 0) {
                ctx.drawImage(obstacle, this.x, this.y, this.width, this.height);
            } else {
                console.error("Ground obstacle image not loaded yet.");
            }
        }
    }

    updateAnimationFrame(timestamp) {
        if(this.isFlying === true){
            if (timestamp - this.lastFrameChange >= this.animationSpeed) {
                this.currentFrame = (this.currentFrame + 1) % 6;
                this.lastFrameChange = timestamp;
            }
        }
    }

    moveLeft(){
        this.x += -this.speedX;
    }

    update(special = false) {
        if (this.x + this.width < 0 || special == true) {
            let isFlying = getFlyState()
            let minDistance = 400;
            let maxDistance = 1700;
            let lastObstacleX = obs[0].x;
            obs.forEach( o => {
                if(o.x > lastObstacleX){
                    lastObstacleX = o.x;
                }
            })
            let newPos;
    
            do {
                newPos = lastObstacleX + getRandomNumber(minDistance, maxDistance);
            } while (newPos - lastObstacleX < minDistance);
    
            this.x = newPos;
            if(isFlying) {
                this.y = this.flyingY
            }
            else{
                this.y = 150;
            }
        }
    }
}

class Player {
    constructor(name, posX, posY, width, height, speedY, floor) {
        this.name = name;
        this.score = 0;
        this.scoreChange = 1;
        this.posX = posX;
        this.posY = posY;
        this.width = width;
        this.baseHeight = height;
        this.currentHeight = height;
        this.speedY = speedY;
        this.floor = floor;
        this.gravity = 0.5;
        this.gravitySpeed = 0;
        this.isJumping = false;
        this.isCrouching = false;
        this.isDead = false;
        this.currentFrame = 0;
        this.lastFrameChange = 0; // Track the last time the frame was changed
        this.animationSpeed = 250; // Change frame every 250ms
        this.revives = 1;
    }

    draw() {
        if (frames[this.currentFrame]) {
            ctx.drawImage(
                frames[this.currentFrame],
                this.posX,
                this.posY,
                this.width,
                this.currentHeight
            );
        }
    }

    drawPlayerName() {
        ctx.beginPath();
        ctx.font  = "15px sans-serif";
        ctx.textAlign = "center";
        ctx.strokeText(this.name,this.posX + (this.width/2),this.posY-13)
    }

    updateAnimationFrame(timestamp) {
        if (timestamp - this.lastFrameChange >= this.animationSpeed) {
            if(this.isCrouching === false){
                if (this.isJumping === false) {
                    // Cycle through walking frames (0-6)
                    if (this.currentFrame > 5) this.currentFrame = 0; // Reset to walking frames
                    this.currentFrame = (this.currentFrame + 1) % 5;
                } 
                else {
                    // Set to jumping frame (7)
                    this.currentFrame = 5;
                }
            }
            else {
                this.currentFrame = 6;
            }
            this.lastFrameChange = timestamp;
        }
    }
    

    jump() {
        if (!this.isJumping && !this.isDead) {
            this.gravitySpeed = -this.speedY;
            this.isJumping = true;
        }
    }

    crouch() {
        this.currentHeight = 30;
        this.isCrouching = true;
    }

    uncrouch() {
        this.currentHeight = this.baseHeight;
        this.isCrouching = false;
    }

    grav() {
        this.gravitySpeed += this.gravity;
        this.posY += this.gravitySpeed;
        if (this.posY >= this.floor - this.currentHeight) {
            this.posY = this.floor - this.currentHeight;
            this.isJumping = false;
            this.gravitySpeed = 0;
        }
    }

    speedUP() {
        let obsSpeed = 10 + 1*level - 1;
        if(this.score >= 500 && this.score < 1000){
            this.scoreChange = 2;
            this.animationSpeed = 225;
            obsSpeed = 10 + 0.25*level - 1 + 1;

        }
        else if(this.score >= 1000 && this.score < 2000){
            this.scoreChange = 3;
            this.animationSpeed = 200;
            obsSpeed = 10 + 0.25*level - 1 + 2;   
        }
        else if(this.score >= 2000 && this.score < 5000){
            this.scoreChange = 5;
            this.animationSpeed = 175;
            obsSpeed = 10 + 0.25*level - 1 + 3;   
        }
        else if(this.score >= 5000 && this.score < 10000){            
            this.scoreChange = 7;
            this.animationSpeed = 125;
            obsSpeed = 10 + 0.25*level - 1 + 4;
        }
        else if(this.score >= 10000){            
            this.scoreChange = 10;
            this.animationSpeed = 100;
            obsSpeed = 10 + 0.25*level - 1 + 5;
        }
        obs.forEach(o => {
            o.speedX = obsSpeed;
        })
    }

    isColliding() {
        for(let i = 0;i<4;i++){
            if((this.posX + this.width > obs[i].x && this.posX <= obs[i].x + obs[i].width) &&  this.posY + this.currentHeight > obs[i].y && this.posY <= obs[i].y + obs[i].width){
                collisionObs = i;
                return true;
            }
        }
        return false;
    }

    playerDie() {
        this.isDead = true;
        this.currentFrame = 0; // Reset to the first frame
    }   

    addScore() {
        this.score += this.scoreChange;
    }
}   

function getFlyState(level) {
    if(level == 1){
        rarity = 0;
    }
    else if(level = 2){
        rarity = 4;
    }
    else if(level = 3){
        rarity = 3;
    }
    else if(level = 4){
        rarity = 2;
    }
    else if(level = 5){
        rarity = 1;
    }
    else{
        rarity = 2;
    }
    let isFlying = getRandomNumber(0,rarity);
    if(isFlying === rarity && isFlying != 0 && level != 6){
        isFlying = true;
    }
    else if(level == 6){
        if(isFlying == rarity){
            isFlying = false;
        }
        else{
            isFlying = true;
        }
    }
    else{
        isFlying = false;
    }
    return isFlying
}

function InitializeObstacles() {
    for (let j = 0; j < 4; j++) {
        let isFlying = getFlyState(level)
        let x;
        if (j === 0) {
            x = player.posX + 1000; // First obstacle starts 1000px away from the player
        } else {
            let minDistance = 500;
            let maxDistance = 2000;
            let lastObstacleX = obs[obs.length - 1].x; // Get the last obstacle's position
    
            do {
                x = lastObstacleX + getRandomNumber(minDistance, maxDistance);
            } while (x - lastObstacleX < minDistance);
        }
    
        obs.push(new Obstacle(x,isFlying));
    }
}


function gameLoop(timestamp, playerName) {
    console.log(playersPlayed)
    let levelName = document.querySelector(".levelName");
    levelName.innerHTML = `Level: ${level}`
    obs = [];
    if(players.length < playerAmount && players.length < playersPlayed + 1){
        player = new Player(playerName, 50, canvas.height - 50, 50, 50, 10, canvas.height);
        players.push(player);
    }
    InitializeObstacles();

    let lastFrameTime = 0;
    const targetFPS = 60;
    const frameDuration = 1000 / targetFPS;
    
    function animate(timestamp) {
        const timeSinceLastFrame = timestamp - lastFrameTime;

        if (timeSinceLastFrame >= frameDuration) {
            lastFrameTime = timestamp;


            ctx.clearRect(0, 0, canvas.width, canvas.height);

            if(!player.isDead){
                addScore();
                player.speedUP();
                player.grav();
                player.updateAnimationFrame(timestamp);
                player.draw();
                player.drawPlayerName();

                collisionObs = 0;
                if (player.isColliding()) {
                    player.playerDie();
                    obs[collisionObs].update(true);
                    if(player.revives > 0){
                        player.revives--;
                        showQuestion();
                    }
                    else{
                        playersPlayed++;
                        playerDeadCount++;
                        if(playerDeadCount < playerAmount){
                            console.log("change")
                            changePlayer();
                        }
                        else{
                            StartGame();
                        }
                        return 0
                    }                    
                }
                    


                for (let j = 0; j < 4; j++) { 
                    obs[j].updateAnimationFrame(timestamp);
                    obs[j].draw();
                    obs[j].moveLeft();
                    obs[j].update();
                }
            }

        }
        if(isRunning){
            animationFrameId = requestAnimationFrame(animate);
        }
    }

    if (!isRunning) {
        if (animationFrameId !== null) {
            cancelAnimationFrame(animationFrameId); // Cancel any existing animation loop
        }
        isRunning = true;
        animate(performance.now());
    }
}

function showQuestion() {
    let questionBox = document.querySelector(".questionBox");
    let question = document.querySelector(".question").cloneNode(true);
    questionBox.style.display = "flex";
    question.style.display = "flex";
    let randQuestion = getRandomQuestion();
    let questionText = question.querySelector(".questionText"); 
    let button = question.querySelectorAll(".answerButton");
    player.playerDie();
    questionText.innerText = randQuestion[0];
    button.forEach((b, index) => { 
        b.innerText = randQuestion[index+1];
        b.addEventListener("click", () => {
            if(b.innerText == randQuestion[5]) {
                console.log("correct")
                player.isDead = false;
                player.revives--;
                questionBox.style.display = "none";
                canvas.style.display = "flex";
                questionBox.removeChild(question);
            }
            else{
                playersPlayed++;
                playerDeadCount++;
                console.log("wrong")
                questionBox.removeChild(question);
                isRunning = false;
                if(playerDeadCount < playerAmount) {
                    changePlayer();
                }
                else{
                    StartGame();
                }

            }
        })
        // b.addEventListener("touchstart", () => {
        //     if(b.innerText == randQuestion[5]) {
        //         console.log("correct")
        //         player.isDead = false;
        //         player.revives--;
        //         questionBox.style.display = "none";
        //         canvas.style.display = "flex";
        //         questionBox.removeChild(question);

        //     }
        //     else{
        //         playerDeadCount++;
        //         console.log("wrong")
        //         questionBox.removeChild(question);
        //         isRunning = false;
        //         if(playerDeadCount < playerAmount) {
        //             changePlayer();
        //         }
        //         else{
        //             StartGame();
        //         }

        //     }
        // })
    })
    canvas.style.display = "none";
    questionBox.appendChild(question);
}

function changePlayer() {
    let newPlayerScreen = document.querySelector(".newPlayerScreen");
    dinogame.style.display = "none";
    newPlayerScreen.style.display = "flex";
    let switchButton = newPlayerScreen.querySelector("#nextPlButton");
    switchButton.addEventListener("click", () => {
        StartGame();
    })
}

function StartGame() {
    let newPlayerScreen = document.querySelector(".newPlayerScreen");
    newPlayerScreen.style.display = "none";
    dinogame.style.display = "flex";
    canvas.style.display = "flex";
    document.getElementById("gameover").style.display = "none";
    isRunning = false
    if(playerDeadCount < playerAmount){
        console.log(players.length)
        gameLoop(performance.now(), playerUsernames[playerDeadCount]);
    }
    else{
        playerDeadCount = 0;
        gameover();
    }
}

function resetGameState() {
    players = [];
    playerUsernames = [];
    playerDeadCount = 0;
    playersPlayed = 0;
    collisionObs = 0;
    isRunning = false;
    if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId); // Cancel any running animation frame
        animationFrameId = null;
    }
}

function nextLevel() {
    let istrue = false;
    players.forEach(pl => {
        console.log(pl.score)
        if(pl.score >= level*1000 && level < 6){
            unlockLevel(level+1);
            istrue = true;
        }
    })
    return istrue;
}


function gameover() {
    let isNextLevelUnlocked = nextLevel()
    let isLevelUnlocked = "";
    if(isNextLevelUnlocked == true){
        console.log(` YOU Unlocked level ${level+1}`);
        isLevelUnlocked = ` YOU Unlocked level ${level+1}`;
    }
    else if(level == 6) {
        console.log("You have already unlocked all the levels, congratulations!");
        isLevelUnlocked = "You have already unlocked all the levels, congratulations!";
    }
    else{
            console.log("unsufficent amount of points!");
            isLevelUnlocked = "unsufficent amount of points!"
        }
    let unlocklevel = document.querySelector(".unlocklevel").innerHTML = isLevelUnlocked;
    let gameoverContainer = document.getElementById("gameover");
    let scoreboard = document.querySelector(".gameoverScoreboard");
    let winner = document.getElementById("winner");
    dinogame.style.display = "none";
    gameoverContainer.style.display = "flex";
    scoreboard.innerHTML = ""
    winner.innerHTML = `WOAH, ${scoresArray[0].name} is the winner!`;
    scoresArray.forEach((score, index) => {
        let scoreText = document.createElement("div");
        scoreText.innerHTML = `${index+1}. ${score.name}: ${score.score}p`;  
        pointsArray[index] += score.score;
        scoreboard.appendChild(scoreText);
    });
    isMoving = true;
    resetGameState();
}

function addScore() {
    scoreboard.innerHTML = "";
    scoresArray = [];
    players.forEach(player => {
        if(player.isDead == false){
            player.addScore();
            player.speedUP(); 
        }
        let tempObject = {
            name: player.name,
            score: player.score
        }
        scoresArray.push(tempObject);
    })
    scoreboard.innerHTML = "Scoreboard:";
    scoresArray.sort((a, b) => b.score - a.score); // Sort in descending order
    scoresArray.forEach((score, index) => {
        let scoreText = document.createElement("div");
        scoreText.innerHTML = `${index+1}. ${score.name}: ${score.score}p`;  
        scoreboard.appendChild(scoreText);
    });  
}




// JUMP AND SHIFT EVENTS
document.addEventListener("keydown", e => {
    if (e.key == "w") {
        player.jump();
    }
    else if (e.key == "s") {
        player.crouch();
    }
});

document.addEventListener("keyup", e => {
    if(e.key == "s"){
        player.uncrouch();
    }
})

//MOUSE AND TOUCH EVENTS

const jumpButton = document.getElementById("jump");
const crouchButton = document.getElementById("crouch");

jumpButton.addEventListener("mousedown", () => {
    player.jump();
    jumpButton.style.transform = "scale(0.95)";
});
jumpButton.addEventListener("mouseup", () => {
    jumpButton.style.transform = "scale(1)";
}); 

jumpButton.addEventListener("touchstart", () => {
    player.jump();
    jumpButton.style.transform = "scale(0.95)";  
})
jumpButton.addEventListener("touchend", () => {
    jumpButton.style.transform = "scale(1)";
}); 

crouchButton.addEventListener("mousedown", () => {
    player.crouch();
    crouchButton.style.transform = "scale(0.95)";
});
crouchButton.addEventListener("mouseup", () => {
    player.uncrouch();
    crouchButton.style.transform = "scale(1)";
}); 

crouchButton.addEventListener("touchstart", () => {
    player.crouch();
    crouchButton.style.transform = "scale(0.95)";  
})
crouchButton.addEventListener("touchend", () => {
    player.uncrouch();
    crouchButton.style.transform = "scale(1)";
}); 