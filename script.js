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
let dogBottom = 120; // Initial position of the dog (raised from 50px)
let cactusSpeed = 3; // Initial cactus animation duration in seconds
let spawnDelay = 2000; // Initial delay between cactus spawns in milliseconds
let difficultyInterval; // To control difficulty scaling

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

    if (dogBottom <= 120) { // Prevent falling below the new ground level
      dogBottom = 120;
      isJumping = false;
      clearInterval(jumpInterval);
    }

    dog.style.bottom = `${dogBottom}px`;
  }, 20); // Smooth interval
}

// Function to increase difficulty
function increaseDifficulty() {
  // Gradually increase cactus speed
  cactusSpeed = Math.max(cactusSpeed - 0.1, 1); // Minimum 1s

  // Gradually reduce spawn delay
  spawnDelay = Math.max(spawnDelay - 100, 800); // Minimum 800ms
}

// Spawn cacti
function spawnCactus() {
  if (isGameOver) return;

  const cactus = document.createElement('div');
  cactus.classList.add('cactus');
  cactus.style.left = '100vw'; // Start at the right edge of the screen
  cactus.style.animationDuration = `${cactusSpeed}s`; // Apply the current cactus speed
  gameContainer.appendChild(cactus);

  cactus.addEventListener('animationend', () => {
    cactus.remove();
  });

  // Check for collisions
  const collisionInterval = setInterval(() => {
    if (isGameOver) {
      clearInterval(collisionInterval);
      return;
    }

    const cactusRect = cactus.getBoundingClientRect();
    const dogRect = dog.getBoundingClientRect();

    const collisionMargin = 10; // Reduce the effective collision area
    if (
      cactusRect.left + collisionMargin < dogRect.right - collisionMargin &&
      cactusRect.right - collisionMargin > dogRect.left + collisionMargin &&
      cactusRect.top + collisionMargin < dogRect.bottom - collisionMargin
    ) {
      gameOver(); // Stop the game on collision
      clearInterval(collisionInterval);
    }
  }, 20);

  // Spawn the next cactus after a random delay
  setTimeout(spawnCactus, Math.random() * spawnDelay + 500); // Randomize spawn delay
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

  // Stop the background animation
  const gameContainer = document.getElementById('game-container');
  gameContainer.style.animation = 'none'; // Stops the background movement

  // Stop all cactus animations
  document.querySelectorAll('.cactus').forEach(cactus => {
    cactus.style.animation = 'none'; // Stops the cactus movement
  });

  // Display the game-over screen
  const gameOverElement = document.getElementById('game-over');
  gameOverElement.style.display = 'block';
}

// Start the game
function startGame() {
  cactusSpeed = 3; // Reset cactus speed
  spawnDelay = 2000; // Reset spawn delay
  clearInterval(difficultyInterval);

  // Gradually increase difficulty every 5 seconds
  difficultyInterval = setInterval(() => {
    if (!isGameOver) {
      increaseDifficulty();
    }
  }, 5000);

  spawnCactus();
  updateScore();
}

// Restart game
restartButton.addEventListener('click', () => {
  isGameOver = false;
  score = 0;
  scoreElement.textContent = 'Score: 0';
  gameOverElement.style.display = 'none';
  dogBottom = 120; // Reset dog position
  dog.style.bottom = `${dogBottom}px`;
  isJumping = false; // Reset jumping flag

  // Remove all existing cacti
  document.querySelectorAll('.cactus').forEach(cactus => cactus.remove());

  // Restart the background animation
  gameContainer.style.animation = ''; // Reset the animation property
  void gameContainer.offsetWidth; // Trigger reflow to restart the animation
  gameContainer.style.animation = 'scrollBackground 3s linear infinite';

  // Start the game
  startGame();
});

// Listen for spacebar to jump
document.addEventListener('keydown', (e) => {
  if (e.code === 'Space') {
    jump();
  }
});

// Start the game
startGame();