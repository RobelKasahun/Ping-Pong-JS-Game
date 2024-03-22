let canvas = document.getElementById('canvas');
let context = canvas.getContext('2d');
// Width and height of the paddle 
const paddleWidth = 15;
const paddleHeight = 170;

// x and y position of the player paddle
let playerPaddleXpos = 0;
let playerPaddleYpos = ((canvas.height - paddleHeight) / 2);

// x and y position of the computer paddle 
let computerPaddleXpos = (canvas.width - paddleWidth);
let computerPaddleYpos = ((canvas.height - paddleHeight) / 2);

// Radius of the ball
const ballRadius = 10;
// We use these values to move the ball around the canvas
let xVelocity = 4;
let yVelocity = -4;

// random computer paddle speed
let computerPaddleSpeed = (Math.random() * 3) + 2;

// Centers the ball
let xBallPos = ((canvas.width - ballRadius) / 2);
let yBallPos = ((canvas.height - ballRadius) / 2);

// arrow up and down
let isArrowUpPressed = false;
let isArrowDownPressed = false;

// Scores for player and computer
let playerScore = sessionStorage.getItem('playerScore');
let computerScore = sessionStorage.getItem('computerScore');

// Sound for top and bottom walls
let topAndBottomWallsSound = new Audio('../sound/wall.mp3');

// Sound for paddle hit
let paddleHitSound = new Audio('../sound/hit.mp3');

// Sets player and computer scores
function setGameScores() {
    // Set the player score to 0 if it is equal to null
    playerScore = (playerScore == null) ? 0 : playerScore;

    // Set the computer score to 0 if it is equal to null
    computerScore = (computerScore == null) ? 0 : computerScore;
}

setGameScores();

// Class for paddle
class Paddle {
    constructor(paddleXpos, paddleYpos, paddleWidth, paddleHeight) {
        this.paddleXpos = paddleXpos;
        this.paddleYpos = paddleYpos;
        this.paddleWidth = paddleWidth;
        this.paddleHeight = paddleHeight;
    }

    // Draws paddle for computer and player with the same width and height
    // but different x and y positions
    drawPaddle() {
        context.beginPath();
        context.rect(this.paddleXpos, this.paddleYpos, this.paddleWidth, this.paddleHeight);
        context.fillStyle = '#000000';
        context.fill();
        context.closePath();
    }
}

// Class for ping pong ball
class Ball {
    constructor(ballXpos, ballYpos, radius, startAngle, endAngle) {
        this.ballXpos = ballXpos;
        this.ballYpos = ballYpos;
        this.radius = radius;
        this.startAngle = startAngle;
        this.endAngle = endAngle;
    }

    // Draws the Ping Pong ball
    drawBall() {
        context.beginPath();
        context.arc(this.ballXpos, this.ballYpos, this.radius, this.startAngle, this.endAngle);
        context.fillStyle = '#000000';
        context.fill();
        context.closePath();
    }
}

// Keydown listener: listens when up and down arrows pressed
document.addEventListener('keydown', keydownHandler, false);

// Keyup listener: listens for events
// sets isArrowUpPressed to false when player lift his or finger from ArrowUp
// sets isArrowDownPressed to false when player lift his or finger from ArrowDown
document.addEventListener('keyup', keyupHandler, false);


function keydownHandler(e) {
    if (e.key == 'ArrowUp') {
        isArrowUpPressed = true;
    } else if (e.key == 'ArrowDown') {
        isArrowDownPressed = true;
    }
}

function keyupHandler(e) {
    if (e.key == 'ArrowUp') {
        isArrowUpPressed = false;
    } else if (e.key == 'ArrowDown') {
        isArrowDownPressed = false;
    }
}

// Draws Scores on canvas
function drawScore() {
    context.textAlign = "start";
    context.font = '30px "Century Gothic",Verdana,sans-serif';
    context.fillStyle = '#000000';
    context.fillText(`${playerScore}   ${computerScore}`, ((canvas.width - 80) / 2), 40);

}

// Draws Vertical net in the middle of the canvas
function drawNet() {
    context.fillStyle = '#000000';
    for (let i = 0; i <= canvas.height; i += 15) {
        context.fillRect((canvas.width - 12) / 2, 0 + i, 3, 10);
    }
}


function init() {
    // Clear every ball you paint
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Draws paddle for player
    let playerPaddle = new Paddle(playerPaddleXpos, playerPaddleYpos, paddleWidth, paddleHeight);
    playerPaddle.drawPaddle();

    // Draws paddle for computer
    let computerPaddle = new Paddle(computerPaddleXpos, computerPaddleYpos, paddleWidth, paddleHeight);
    computerPaddle.drawPaddle();

    // Draws the game ball
    let ball = new Ball(xBallPos, yBallPos, ballRadius, 0, (Math.PI * 2));
    ball.drawBall();

    // Draw player score
    drawScore();

    // Draws ping pong net
    drawNet();


    // Collision detection for top and bottom walls
    if (((yBallPos + yVelocity) < ballRadius) || ((yBallPos + yVelocity) > (canvas.height - ballRadius))) {
        topAndBottomWallsSound.play();
        yVelocity = -yVelocity;
    }

    // Collision detection for player paddle
    if ((xBallPos - paddleWidth) < ballRadius) {
        if ((yBallPos >= playerPaddleYpos) && (yBallPos <= playerPaddleYpos + paddleHeight)) {
            paddleHitSound.play();
            xVelocity = -xVelocity + (Math.PI / 4);
        } else {
            ++computerScore;
            // Store computer score in the session storage
            sessionStorage.setItem('computerScore', computerScore);
            document.location.reload();
            clearInterval(interval);
        }
    }

    // Collision detection for computer paddle
    if ((xBallPos + paddleWidth) > (canvas.width - ballRadius)) {
        if ((yBallPos >= computerPaddleYpos) && (yBallPos <= computerPaddleYpos + paddleHeight)) {
            paddleHitSound.play();
            xVelocity = -xVelocity;
        } else {
            ++playerScore;
            // Store player in the session storage
            sessionStorage.setItem('playerScore', playerScore);
            document.location.reload();
            clearInterval(interval);
        }
    }

    // Updates the player paddle y position by -7 
    if (isArrowUpPressed) {
        playerPaddleYpos -= 7;
        // sets player paddle y position to 0 if 
        // the y position of the player paddle is negative
        if ((playerPaddleYpos) < 0) {
            playerPaddleYpos = 0;
        }
        // Updates the y position of the player paddle by 7
    } else if (isArrowDownPressed) {
        playerPaddleYpos += 7;
        // if the y positon of the player paddle is bigger that the canvas height minus the paddle Height
        // set the y position of the player paddle to maximum height of the canvas 
        if ((playerPaddleYpos) > (canvas.height - paddleHeight)) {
            playerPaddleYpos = (canvas.height - paddleHeight);
        }
    }

    // Change the y position of computer paddle randomly
    // This acts as small AI
    computerPaddleYpos += ((yVelocity > 0) ? (computerPaddleSpeed) : (-1 * computerPaddleSpeed));

    // Force the computer paddle
    if (computerPaddleYpos < 0) {
        computerPaddleYpos = 0;
    } else if (computerPaddleYpos > (canvas.height - paddleHeight)) {
        computerPaddleYpos = (canvas.height - paddleHeight);
    }

    if ((computerScore == 5) && (computerScore > playerScore)) {
        // Computer Won
        sessionStorage.setItem('computer', "COMPUTER WON!!!");
        location.replace('../pages/game_over.html');
    } else if ((playerScore == 5) && (playerScore > computerScore)) {
        // Player won
        location.replace('../pages/game_over.html');
        sessionStorage.setItem('player', "PLAYER WON!!!");
    }

    // Constant velocity of the ball
    xBallPos += xVelocity;
    yBallPos += yVelocity;
}

let interval = setInterval(init, 10);