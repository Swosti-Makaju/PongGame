const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');

// Game constants
const PADDLE_WIDTH = 15;
const PADDLE_HEIGHT = 100;
const BALL_SIZE = 16;
const PLAYER_X = 30;
const AI_X = canvas.width - 30 - PADDLE_WIDTH;

// Game objects
let playerY = (canvas.height - PADDLE_HEIGHT) / 2;
let aiY = (canvas.height - PADDLE_HEIGHT) / 2;
let ball = {
    x: canvas.width / 2 - BALL_SIZE / 2,
    y: canvas.height / 2 - BALL_SIZE / 2,
    vx: 5 * (Math.random() > 0.5 ? 1 : -1),
    vy: 4 * (Math.random() > 0.5 ? 1 : -1)
};

let playerScore = 0;
let aiScore = 0;

// Mouse control for player paddle
canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    let mouseY = e.clientY - rect.top;
    playerY = mouseY - PADDLE_HEIGHT / 2;
    // Clamp within canvas
    playerY = Math.max(0, Math.min(canvas.height - PADDLE_HEIGHT, playerY));
});

// Draw paddles, ball, and scores
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw center line
    ctx.strokeStyle = "#666";
    ctx.setLineDash([10, 15]);
    ctx.beginPath();
    ctx.moveTo(canvas.width/2, 0);
    ctx.lineTo(canvas.width/2, canvas.height);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw paddles
    ctx.fillStyle = "#0ff";
    ctx.fillRect(PLAYER_X, playerY, PADDLE_WIDTH, PADDLE_HEIGHT);

    ctx.fillStyle = "#f00";
    ctx.fillRect(AI_X, aiY, PADDLE_WIDTH, PADDLE_HEIGHT);

    // Draw ball
    ctx.fillStyle = "#fff";
    ctx.fillRect(ball.x, ball.y, BALL_SIZE, BALL_SIZE);

    // Draw scores
    ctx.font = "36px Arial";
    ctx.fillStyle = "#fff";
    ctx.fillText(playerScore, canvas.width/4, 50);
    ctx.fillText(aiScore, 3*canvas.width/4, 50);
}

// Ball movement and collision
function updateBall() {
    ball.x += ball.vx;
    ball.y += ball.vy;

    // Top and bottom wall collision
    if (ball.y <= 0 || ball.y + BALL_SIZE >= canvas.height) {
        ball.vy *= -1;
    }

    // Left paddle collision
    if (
        ball.x <= PLAYER_X + PADDLE_WIDTH &&
        ball.x >= PLAYER_X &&
        ball.y + BALL_SIZE >= playerY &&
        ball.y <= playerY + PADDLE_HEIGHT
    ) {
        ball.vx *= -1;
        // Add a bit of randomness
        ball.vy += (Math.random() - 0.5) * 2;
        ball.x = PLAYER_X + PADDLE_WIDTH; // prevent sticking
    }

    // Right (AI) paddle collision
    if (
        ball.x + BALL_SIZE >= AI_X &&
        ball.x + BALL_SIZE <= AI_X + PADDLE_WIDTH &&
        ball.y + BALL_SIZE >= aiY &&
        ball.y <= aiY + PADDLE_HEIGHT
    ) {
        ball.vx *= -1;
        ball.vy += (Math.random() - 0.5) * 2;
        ball.x = AI_X - BALL_SIZE; // prevent sticking
    }

    // Left wall - AI scores
    if (ball.x < 0) {
        aiScore++;
        resetBall();
    }
    // Right wall - Player scores
    if (ball.x + BALL_SIZE > canvas.width) {
        playerScore++;
        resetBall();
    }
}

// Reset ball to center
function resetBall() {
    ball.x = canvas.width / 2 - BALL_SIZE / 2;
    ball.y = canvas.height / 2 - BALL_SIZE / 2;
    ball.vx = 5 * (Math.random() > 0.5 ? 1 : -1);
    ball.vy = 4 * (Math.random() > 0.5 ? 1 : -1);
}

// Basic AI movement
function updateAI() {
    let target = ball.y + BALL_SIZE/2 - PADDLE_HEIGHT/2;
    // Move AI paddle towards the ball
    const aiSpeed = 5;
    if (aiY < target) {
        aiY += aiSpeed;
        if (aiY > target) aiY = target;
    } else if (aiY > target) {
        aiY -= aiSpeed;
        if (aiY < target) aiY = target;
    }
    // Clamp within canvas
    aiY = Math.max(0, Math.min(canvas.height - PADDLE_HEIGHT, aiY));
}

// Main game loop
function gameLoop() {
    updateBall();
    updateAI();
    draw();
    requestAnimationFrame(gameLoop);
}

// Start game
gameLoop();