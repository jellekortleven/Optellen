const container = document.getElementById("game-container");
const scoreDisplay = document.getElementById("score");
const startButton = document.getElementById("start-button");
const resetButton = document.getElementById("reset-button");

const correctSound = document.getElementById("correct-sound");
const wrongSound = document.getElementById("wrong-sound");

let currentNumber = 1;
let timeLeft = 15;
let round = 1;
let timer;
let highScore = 0;
let gameRunning = false;

const colors = ["#ff4d4d", "#4db8ff", "#4dff88", "#ffa64d", "#b84dff"];

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function createButtons() {
  container.innerHTML = "";
  currentNumber = 1;
  const numbers = shuffle([...Array(10).keys()].map(n => n + 1));
  const maxLeft = container.clientWidth - 80;
  const maxTop = container.clientHeight - 80;

  numbers.forEach(n => {
    const btn = document.createElement("button");
    btn.innerText = n;
    btn.className = "bubble";
    btn.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    btn.style.left = Math.random() * maxLeft + "px";
    btn.style.top = Math.random() * maxTop + "px";
    btn.onclick = () => handleClick(n, btn);
    container.appendChild(btn);
  });

  document.getElementById("round-info").innerText = `Ronde: ${round}`;
}

function showMessage(text) {
  const msg = document.createElement("div");
  msg.innerText = text;
  msg.className = "message";
  container.appendChild(msg);
  setTimeout(() => msg.remove(), 1000);
}

function handleClick(n, button) {
  if (!gameRunning) return;
  if (n === currentNumber) {
    currentNumber++;
    correctSound.play();
    showMessage("Goed zo!");
    button.classList.add("clicked");
    setTimeout(() => button.remove(), 400);

    if (currentNumber > 10) {
      clearInterval(timer);
      round++;
      timeLeft = Math.max(1, 15 - (round - 1));
      highScore = Math.max(highScore, round - 1);
      updateScore();
      setTimeout(startRound, 1000);
    }
  } else {
    wrongSound.play();
    alert(`Game Over! Je haalde ronde ${round - 1}. Hoogste score: ${highScore}`);
    resetGame();
  }
}

function startTimer() {
  let t = timeLeft;
  document.getElementById("timer").innerText = `Tijd: ${t.toFixed(1)}s`;
  timer = setInterval(() => {
    t -= 0.1;
    document.getElementById("timer").innerText = `Tijd: ${t.toFixed(1)}s`;
    if (t <= 0) {
      clearInterval(timer);
      alert(`Tijd op! Je haalde ronde ${round - 1}. Hoogste score: ${highScore}`);
      resetGame();
    }
  }, 100);
}

function startRound() {
  createButtons();
  startTimer();
}

function resetGame() {
  round = 1;
  timeLeft = 15;
  gameRunning = false;
  container.innerHTML = "";
  document.getElementById("round-info").innerText = "Ronde: 0";
  document.getElementById("timer").innerText = "Tijd: 0";
}

function updateScore() {
  scoreDisplay.innerText = `Highscore: ${highScore}`;
}

startButton.onclick = () => {
  if (!gameRunning) {
    gameRunning = true;
    startRound();
  }
};

resetButton.onclick = resetGame;

window.onload = () => {
  updateScore();
};
