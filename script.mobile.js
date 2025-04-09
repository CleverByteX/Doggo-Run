// Variables for game state (if not already defined)
let isGameOver = false;
let isJumping = false;
let score = 0;
const dog = document.getElementById('dog');
const gameContainer = document.getElementById('game-container');
const scoreElement = document.getElementById('score');
const gameOverElement = document.getElementById('game-over');
const restartButton = document.getElementById('restart-button');
let dogBottom = 12; // in vh units; originally 12vh as the base level

// Allow jump on touch (and spacebar for testing)
document.addEventListener('touchstart', () => {
  jump();
});
document.addEventListener('keydown', (e) => {
  if (e.code === 'Space') {
    jump();
  }
});

// Simple jump function (adjust as needed)
function jump() {
  if (isJumping) return;
  isJumping = true;
  let jumpHeight = 0;
  // Jump up for 200ms then fall down (using setInterval for simplicity)
  const jumpInterval = setInterval(() => {
    // Increase height until a max delta (e.g. 20 vh)
    if (jumpHeight >= 20) {
      clearInterval(jumpInterval);
      // Start falling down
      const fallInterval = setInterval(() => {
        if (jumpHeight <= 0) {
          clearInterval(fallInterval);
          isJumping = false;
          jumpHeight = 0;
        }
        jumpHeight -= 2;
        dog.style.bottom = `${dogBottom + jumpHeight}vh`;
      }, 20);
    } else {
      jumpHeight += 2;
      dog.style.bottom = `${dogBottom + jumpHeight}vh`;
    }
  }, 20);
}

// Define cactus spawning
function spawnCactus() {
  if (isGameOver) return;
  
  const cactus = document.createElement('div');
  cactus.className = 'cactus';
  cactus.style.left = '100vw'; // start off-screen
  gameContainer.appendChild(cactus);
  
  // Remove cactus after its animation ends
  cactus.addEventListener('animationend', () => {
    cactus.remove();
  });
  
  // Spawn the next cactus after a random delay (between 1-3 seconds)
  setTimeout(spawnCactus, Math.random() * 2000 + 1000);
}

// --- NEW --- Collision detection function
function checkCollision() {
  const dogRect = dog.getBoundingClientRect();
  document.querySelectorAll('.cactus').forEach(cactus => {
    const cactusRect = cactus.getBoundingClientRect();
    if (
      dogRect.left < cactusRect.right &&
      dogRect.right > cactusRect.left &&
      dogRect.top < cactusRect.bottom &&
      dogRect.bottom > cactusRect.top
    ) {
      gameOver();
    }
  });
  if (!isGameOver) {
    requestAnimationFrame(checkCollision);
  }
}

// --- NEW --- Score updating function
function updateScore() {
  if (isGameOver) return;
  score++;
  scoreElement.textContent = 'Score: ' + score;
  setTimeout(updateScore, 100); // Update score every 100ms
}

// --- NEW --- Game Over function
function gameOver() {
  isGameOver = true;
  gameOverElement.style.display = 'block';
  // (You can optionally add additional game-over handling here)
}

// Start the game
function startGame() {
  isGameOver = false;
  spawnCactus();
  updateScore();
}

// Restart game logic for mobile
restartButton.addEventListener('click', () => {
  isGameOver = false;
  score = 0;
  scoreElement.textContent = 'Score: 0';
  gameOverElement.style.display = 'none';
  dogBottom = 12; // Reset dog's base level (in vh)
  dog.style.bottom = `${dogBottom}vh`;
  isJumping = false;
  
  // Remove all existing cacti
  document.querySelectorAll('.cactus').forEach(c => c.remove());
  
  // Restart background animation
  gameContainer.style.animation = '';
  void gameContainer.offsetWidth;  // trigger reflow
  gameContainer.style.animation = 'scrollBackground 3s linear infinite';
  
  startGame();
});

// Start collision detection and score update once the game starts
window.addEventListener('load', () => {
  console.log("Mobile game started");
  startGame();
  requestAnimationFrame(checkCollision);
  updateScore();
});