const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const GRAVITY = 0.1;
const JUMP = -3;
let gameOver = false;
let score = 0;

// Placeholder "head" image
const headImg = new Image();
headImg.src = 'head.png'; // Replace with actual image later

const player = {
  x: 50,
  y: 150,
  width: 40,
  height: 40,
  velocity: 0.1
};

const pipes = [];
const PIPE_WIDTH = 60;
const PIPE_GAP = 140;
let frameCount = 0;

function drawPlayer() {
  ctx.drawImage(headImg, player.x, player.y, player.width, player.height);
}

function drawPipe(pipe) {
  ctx.fillStyle = '#228B22';
  // Top pipe
  ctx.fillRect(pipe.x, 0, PIPE_WIDTH, pipe.top);
  // Bottom pipe
  ctx.fillRect(pipe.x, pipe.top + PIPE_GAP, PIPE_WIDTH, canvas.height - pipe.top - PIPE_GAP);
}

function createPipe() {
  const top = Math.random() * (canvas.height / 2);
  pipes.push({ x: canvas.width, top });
}

function update() {
  if (gameOver){
    document.getElementById('restartBtn').style.display = 'block';
    return;
  } 
    

  frameCount++;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Update player
  player.velocity += GRAVITY;
  player.y += player.velocity;

  if (frameCount % 150 === 0) {
    createPipe();
  }

  for (let i = 0; i < pipes.length; i++) {
    const pipe = pipes[i];
    pipe.x -= 2;

    drawPipe(pipe);

    // Collision check
    if (
      player.x < pipe.x + PIPE_WIDTH &&
      player.x + player.width > pipe.x &&
      (
        player.y < pipe.top ||
        player.y + player.height > pipe.top + PIPE_GAP
      )
    ) {
      gameOver = true;
      document.getElementById('restartBtn').style.display = 'block';
    }

    // Scoring
    if (!pipe.passed && pipe.x + PIPE_WIDTH < player.x) {
      pipe.passed = true;
      score++;
      if (score === 10) {
        gameOver = true;
        document.getElementById('message').style.display = 'block';
        document.getElementById('restartBtn').style.display = 'block';
      }
    }
  }

  drawPlayer();

  // Ground collision
  if (player.y + player.height > canvas.height || player.y < 0) {
    gameOver = true;
  }

  requestAnimationFrame(update);
}

document.addEventListener('keydown', (e) => {
  if (e.code === 'Space' && !gameOver) {
    player.velocity = JUMP;
  }
});

document.addEventListener('mousedown', () => {
  if (!gameOver) {
    player.velocity = JUMP;
  }
});

headImg.onload = () => {
  update();
};
document.getElementById('restartBtn').addEventListener('click', () => {
  // Reset game state
  player.y = 150;
  player.velocity = 0.1;
  pipes.length = 0;
  frameCount = 0;
  score = 0;
  gameOver = false;

  document.getElementById('message').style.display = 'none';
  document.getElementById('restartBtn').style.display = 'none';

  update(); // restart the game loop
});
