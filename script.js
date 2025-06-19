// Pong Game

const canvas = document.getElementById("pong");
const ctx = canvas.getContext("2d");

// Game Constants
const PADDLE_WIDTH = 12;
const PADDLE_HEIGHT = 90;
const PLAYER_X = 30;
const AI_X = canvas.width - PLAYER_X - PADDLE_WIDTH;
const BALL_RADIUS = 10;
const PADDLE_COLOR = "#fff";
const BALL_COLOR = "#ff6f00";
const NET_COLOR = "#888";

// Game State
let playerY = (canvas.height - PADDLE_HEIGHT) / 2;
let aiY = (canvas.height - PADDLE_HEIGHT) / 2;
let ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    vx: 5 * (Math.random() > 0.5 ? 1 : -1),
    vy: 3 * (Math.random() > 0.5 ? 1 : -1),
    speed: 6
};
let playerScore = 0;
let aiScore = 0;

// Draw Net
function drawNet() {
    const segmentHeight = 25;
    for (let i = 0; i < canvas.height; i += segmentHeight * 2) {
        ctx.fillStyle = NET_COLOR;
        ctx.fillRect(canvas.width / 2 - 2, i, 4, segmentHeight);
    }
}

// Draw Paddle
function drawPaddle(x, y) {
    ctx.fillStyle = PADDLE_COLOR;
    ctx.fillRect(x, y, PADDLE_WIDTH, PADDLE_HEIGHT);
}

// Draw Ball
function drawBall() {
    ctx.fillStyle = BALL_COLOR;
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, BALL_RADIUS, 0, Math.PI * 2, false);
    ctx.closePath();
    ctx.fill();
}

// Draw Score
function drawScore() {
    ctx.font = "32px Arial";
    ctx.fillStyle = "#fff";
    ctx.fillText(playerScore, canvas.width / 2 - 60, 50);
    ctx.fillText(aiScore, canvas.width / 2 + 35, 50);
}

// Move Ball and Handle Collisions
function update() {
    // Ball movement
    ball.x += ball.vx;
    ball.y += ball.vy;

    // Top/Bottom wall collision
    if (ball.y - BALL_RADIUS < 0 || ball.y + BALL_RADIUS > canvas.height) {
        ball.vy = -ball.vy;
    }

    // Player paddle collision
    if (
        ball.x - BALL_RADIUS < PLAYER_X + PADDLE_WIDTH &&
        ball.x - BALL_RADIUS > PLAYER_X &&
        ball.y > playerY &&
        ball.y < playerY + PADDLE_HEIGHT
    ) {
        ball.x = PLAYER_X + PADDLE_WIDTH + BALL_RADIUS; // avoid sticking
        let collidePoint = (ball.y - (playerY + PADDLE_HEIGHT / 2)) / (PADDLE_HEIGHT / 2);
        let angle = collidePoint * Math.PI / 4;
        let direction = 1;
        ball.vx = direction * ball.speed * Math.cos(angle);
        ball.vy = ball.speed * Math.sin(angle);
    }

    // AI paddle collision
    if (
        ball.x + BALL_RADIUS > AI_X &&
        ball.x + BALL_RADIUS < AI_X + PADDLE_WIDTH &&
        ball.y > aiY &&
        ball.y < aiY + PADDLE_HEIGHT
    ) {
        ball.x = AI_X - BALL_RADIUS; // avoid sticking
        let collidePoint = (ball.y - (aiY + PADDLE_HEIGHT / 2)) / (PADDLE_HEIGHT / 2);
        let angle = collidePoint * Math.PI / 4;
        let direction = -1;
        ball.vx = direction * ball.speed * Math.cos(angle);
        ball.vy = ball.speed * Math.sin(angle);
    }

    // Score and reset
    if (ball.x < 0) {
        aiScore++;
        resetBall();
    } else if (ball.x > canvas.width) {
        playerScore++;
        resetBall();
    }

    // AI movement (simple tracking)
    let aiCenter = aiY + PADDLE_HEIGHT / 2;
    if (ball.y < aiCenter - 20) {
        aiY -= 4;
    } else if (ball.y > aiCenter + 20) {
        aiY += 4;
    }
    // Clamp AI paddle
    aiY = Math.max(0, Math.min(canvas.height - PADDLE_HEIGHT, aiY));
}

// Reset ball to center
function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.vx = 5 * (Math.random() > 0.5 ? 1 : -1);
    ball.vy = 3 * (Math.random() > 0.5 ? 1 : -1);
}

// Main Draw Function
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawNet();
    drawScore();
    drawPaddle(PLAYER_X, playerY);
    drawPaddle(AI_X, aiY);
    drawBall();
}

// Mouse Movement for Player Paddle
canvas.addEventListener("mousemove", function(evt) {
    let rect = canvas.getBoundingClientRect();
    let mouseY = evt.clientY - rect.top;
    playerY = mouseY - PADDLE_HEIGHT / 2;
    // Clamp
    playerY = Math.max(0, Math.min(canvas.height - PADDLE_HEIGHT, playerY));
});

// Main game loop
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Start the game
gameLoop();