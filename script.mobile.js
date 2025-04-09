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

// Start the game
startGame();