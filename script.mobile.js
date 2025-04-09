// Allow jumping with touch on mobile
document.addEventListener('touchstart', () => {
  jump();
});

// Existing spacebar listener for desktop
document.addEventListener('keydown', (e) => {
  if (e.code === 'Space') {
    jump();
  }
});

// Restart game logic
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

const gameContainer = document.getElementById('game-container');

function spawnCactus() {
  if (isGameOver) return;

  const cactus = document.createElement('div');
  cactus.className = 'cactus';
  cactus.style.left = '100vw'; // Start at the right edge of the screen
  gameContainer.appendChild(cactus);

  // Remove cactus after animation ends
  cactus.addEventListener('animationend', () => {
    cactus.remove();
  });

  // Spawn the next cactus after a random delay
  setTimeout(spawnCactus, Math.random() * 2000 + 1000); // Random delay between 1-3 seconds
}

// Start the game
function startGame() {
  isGameOver = false;
  spawnCactus(); // Start spawning cacti
  updateScore(); // Start updating the score
}

// Start the game on page load
window.addEventListener('load', () => {
  console.log("Game started"); // Debugging log
  startGame();
});

<script src="script.mobile.js"></script>