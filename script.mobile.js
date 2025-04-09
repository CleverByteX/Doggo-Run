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

// Dummy updateScore function
function updateScore() {
  // Your score update logic here...
  // (For debugging, you might want to log or update the DOM)
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

// Start the game on page load
window.addEventListener('load', () => {
  console.log("Mobile game started");
  startGame();
});