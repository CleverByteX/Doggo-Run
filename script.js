const dog = document.getElementById('dog');
const gameContainer = document.getElementById('game-container');
const scoreElement = document.getElementById('score');
const gameOverElement = document.getElementById('game-over');
const restartButton = document.getElementById('restart-button');

let isJumping = false;
let isGameOver = false;
let score = 0;
let gravity = 0.9;
let velocity = 0;
let dogBottom = 50; // Initial position of the dog

// Make the dog jump
function jump() {
  if (isJumping) return; // Prevent double jumps
  isJumping = true;
  velocity = 20; // Incrementa la velocidad inicial del salto

  const jumpInterval = setInterval(() => {
    if (isGameOver) {
      clearInterval(jumpInterval);
      return;
    }

    velocity -= gravity; // Apply gravity
    dogBottom += velocity;

    if (dogBottom <= 50) { // Prevent falling below the ground
      dogBottom = 50;
      isJumping = false;
      clearInterval(jumpInterval);
    }

    dog.style.bottom = `${dogBottom}px`;
  }, 20); // Smooth interval
}

// Spawn cacti
function spawnCactus() {
  if (isGameOver) return;
  const cactus = document.createElement('div');
  cactus.classList.add('cactus');
  gameContainer.appendChild(cactus);

  cactus.style.right = '-50px';

  const moveInterval = setInterval(() => {
    if (isGameOver) {
      clearInterval(moveInterval);
      cactus.remove();
      return;
    }

    const cactusRect = cactus.getBoundingClientRect();
    const dogRect = dog.getBoundingClientRect();

    // Ajustar detección de colisión
    const collisionMargin = 10; // Reduce el área efectiva de colisión
    if (
      cactusRect.left + collisionMargin < dogRect.right - collisionMargin &&
      cactusRect.right - collisionMargin > dogRect.left + collisionMargin &&
      cactusRect.top + collisionMargin < dogRect.bottom - collisionMargin
    ) {
      gameOver();
      clearInterval(moveInterval);
      cactus.remove();
    }

    if (cactusRect.right <= 0) {
      cactus.remove();
      clearInterval(moveInterval);
    }

    // Incrementa la velocidad del cactus con el puntaje
    const speed = 5 + Math.floor(score / 100);
    cactus.style.right = `${parseInt(cactus.style.right) + speed}px`;
  }, 20);

  setTimeout(spawnCactus, Math.random() * 2000 + 1000);
}

// Update score
function updateScore() {
  if (isGameOver) return;
  score++;
  scoreElement.textContent = `Score: ${score}`;
  setTimeout(updateScore, 100);
}

// Game over
function gameOver() {
  isGameOver = true;
  gameOverElement.style.display = 'block';
}

// Restart game
restartButton.addEventListener('click', () => {
  isGameOver = false;
  score = 0;
  scoreElement.textContent = 'Score: 0';
  gameOverElement.style.display = 'none';
  dogBottom = 50; // Reset dog position
  dog.style.bottom = `${dogBottom}px`;
  isJumping = false; // Reset jumping flag
  document.querySelectorAll('.cactus').forEach(cactus => cactus.remove()); // Limpia cactos
  spawnCactus();
  updateScore();
});

// Listen for spacebar to jump
document.addEventListener('keydown', (e) => {
  if (e.code === 'Space') {
    jump();
  }
});

// Start the game
spawnCactus();
updateScore();