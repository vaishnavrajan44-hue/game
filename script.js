/*
  JavaScript (JS) makes the page INTERACTIVE.
  It runs in the browser and can:
  - Respond to clicks
  - Change HTML content
  - Save data to the browser's storage
  - Run timers

  HOW THIS FILE IS ORGANIZED:
  1.  Grab all the HTML elements we need (DOM References)
  2.  Set up variables to track the game state
  3.  Define functions (reusable blocks of code)
  4.  Wire up event listeners (waiting for clicks)
  5.  Run the initial setup
*/

// ==========================================================
// 1. DOM REFERENCES
//    "DOM" = Document Object Model = the HTML page.
//    We use document.getElementById() to grab HTML elements
//    by their id attribute so we can work with them in JS.
// ==========================================================

// Screens (the three different views the player sees)
const landing   = document.getElementById('landing');
const game      = document.getElementById('game');
const gameOver  = document.getElementById('gameOver');

// Buttons
const startBtn      = document.getElementById('startBtn');
const clickBtn      = document.getElementById('clickBtn');
const playAgainBtn  = document.getElementById('playAgainBtn');

// Stats display (where numbers appear)
const timerDisplay  = document.getElementById('timer');
const scoreDisplay  = document.getElementById('score');
const finalScore    = document.getElementById('finalScore');

// High score displays (shown on landing and game-over screens)
const landingHighScore   = document.getElementById('landingHighScore');
const gameOverHighScore  = document.getElementById('gameOverHighScore');

// ==========================================================
// 2. GAME STATE VARIABLES
//    These keep track of what's happening during the game.
//    "let" means the value can change later.
// ==========================================================

let score     = 0;   // How many times the player has clicked
let timeLeft  = 10;  // Seconds remaining (starts at 10)
let timerId   = null;
/*
  timerId stores the ID of our countdown timer.
  We need this so we can stop the timer later.
  null means "no timer is running right now."
*/
let isRunning = false;
/*
  isRunning is a boolean (true/false).
  It prevents counting clicks before the game starts
  or after the game ends.
*/

// ==========================================================
// 3. HIGH SCORE (localStorage)
//    localStorage saves data in the browser even after
//    the page is closed. It's like a tiny database.
// ==========================================================

/*
  getHighScore() reads the saved high score from localStorage.
  If nothing is saved yet, it returns 0.
  parseInt() converts a string to a number.
*/
function getHighScore() {
  return parseInt(localStorage.getItem('clickSpeedHighScore')) || 0;
}

/*
  setHighScore(val) saves a new high score to localStorage.
  localStorage can only store strings, so we use .toString()
  (it happens automatically, but good to know).
*/
function setHighScore(val) {
  localStorage.setItem('clickSpeedHighScore', val);
}

/*
  updateHighScoreDisplays() refreshes the high score numbers
  shown on the landing and game-over screens.
  We call this whenever the high score might have changed.
*/
function updateHighScoreDisplays() {
  const hs = getHighScore();
  landingHighScore.textContent  = hs;
  gameOverHighScore.textContent = hs;
}

// ==========================================================
// 4. SCREEN MANAGEMENT
//    We have 3 screens but only one shows at a time.
//    We hide all screens, then show the one we want.
// ==========================================================

function showScreen(screen) {
  // Add "hidden" class to all screens (hides them)
  landing.classList.add('hidden');
  game.classList.add('hidden');
  gameOver.classList.add('hidden');

  // Remove "hidden" class from the screen we want to show
  screen.classList.remove('hidden');
}

// ==========================================================
// 5. RESET GAME
//    Puts all variables back to their starting values.
//    Does NOT touch the high score (we want to keep that).
// ==========================================================

function resetGame() {
  score    = 0;     // Reset click count to zero
  timeLeft = 10;    // Reset timer back to 10 seconds
  isRunning = false; // Disable further clicks

  // If a timer is still ticking, stop it
  if (timerId) {
    clearInterval(timerId);
    timerId = null;
  }

  // Update the display to show the starting values
  scoreDisplay.textContent = 0;
  timerDisplay.textContent = 10;
}

// ==========================================================
// 6. START GAME
//    Called when the player clicks "Start Game".
//    It shows the game screen and starts the countdown.
// ==========================================================

function startGame() {
  resetGame();         // Clear any previous game data
  showScreen(game);    // Switch to the game screen
  isRunning = true;    // Now clicks will be counted

  /*
    setInterval() runs a function every X milliseconds.
    1000 milliseconds = 1 second.
    It returns an ID we store in timerId so we can
    cancel it later with clearInterval().
  */
  timerId = setInterval(() => {
    // This arrow function runs once every second

    timeLeft -= 1;                 // Decrease time by 1
    timerDisplay.textContent = timeLeft; // Show the new time

    // When the timer hits 0, end the game
    if (timeLeft <= 0) {
      endGame();
    }
  }, 1000); // 1000ms = 1 second
}

// ==========================================================
// 7. HANDLE CLICKS
//    Every time the player clicks "Click Me!", we add 1
//    to the score and update the display.
// ==========================================================

clickBtn.addEventListener('click', () => {
  // If the game isn't running, ignore the click
  if (!isRunning) return;

  score += 1;                 // Add 1 to the score
  scoreDisplay.textContent = score; // Show the new score
});

// ==========================================================
// 8. END GAME
//    Called when the timer reaches 0.
//    Stops the timer, saves the high score, and shows
//    the game-over screen.
// ==========================================================

function endGame() {
  isRunning = false;       // Stop counting clicks
  clearInterval(timerId);  // Stop the timer
  timerId = null;          // Mark that no timer is running

  // Check if this score beats the high score
  const hs = getHighScore();
  if (score > hs) {
    setHighScore(score);   // Save the new record
  }

  // Update displays and show the game-over screen
  finalScore.textContent = score;
  updateHighScoreDisplays();
  showScreen(gameOver);
}

// ==========================================================
// 9. EVENT LISTENERS
//    These tell JavaScript: "When this button is clicked,
//    run this function."
// ==========================================================

startBtn.addEventListener('click', startGame);
// When "Start Game" is clicked, run startGame()

playAgainBtn.addEventListener('click', () => {
  // When "Play Again" is clicked:
  resetGame();                // Reset everything
  updateHighScoreDisplays();  // Show the latest high score
  showScreen(landing);        // Go back to the landing screen
});

// ==========================================================
// 10. INITIAL SETUP
//     This runs when the page first loads.
//     Shows the landing screen with the saved high score.
// ==========================================================

updateHighScoreDisplays();
// Show whatever high score is saved (or 0 if first visit)
