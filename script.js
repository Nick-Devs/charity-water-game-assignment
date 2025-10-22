const game = document.getElementById("game");
const bucket = document.getElementById("bucket");
const scoreDisplay = document.getElementById("score");

let score = 0;
let bucketX = window.innerWidth / 2;
let drops = [];

let lastDropTime = 0;
let dropInterval = 0;
let dropSpeed = 1;

let baseDropInterval = 5000; 
let minDropInterval = 800;    
let maxDropSpeed = 6;         


let difficulty = prompt("Choose difficulty: easy, normal, or hard", "normal");
difficulty = difficulty ? difficulty.toLowerCase() : "normal";

switch (difficulty) {
  case "easy":
    baseDropInterval = 7500;
    dropSpeed = 0.8;
    break;
  case "hard":
    baseDropInterval = 3500;
    dropSpeed = 1.5;
    break;
  default: // normal
    baseDropInterval = 5000;
    dropSpeed = 1;
    break;
}

dropInterval = baseDropInterval;

function createDrop() {
  const drop = document.createElement("div");
  drop.classList.add("drop");
  drop.style.left = Math.random() * (window.innerWidth - 20) + "px";
  drop.style.top = "0px";
  game.appendChild(drop);
  drops.push(drop);
}

function moveBucket(e) {
  const step = 10;
  if (e.key === "ArrowLeft" && bucketX > 0) bucketX -= step;
  if (e.key === "ArrowRight" && bucketX < window.innerWidth - 100) bucketX += step;
  bucket.style.left = bucketX + "px";
}

function updateDrops() {
  for (let i = drops.length - 1; i >= 0; i--) {
    const drop = drops[i];
    let top = parseFloat(drop.style.top);
    top += dropSpeed;
    drop.style.top = top + "px";

    const dropRect = drop.getBoundingClientRect();
    const bucketRect = bucket.getBoundingClientRect();

    if (
      dropRect.bottom >= bucketRect.top &&
      dropRect.left >= bucketRect.left &&
      dropRect.right <= bucketRect.right
    ) {
      // Caught
      score += 10;
      scoreDisplay.textContent = "Score: " + score;
      game.removeChild(drop);
      drops.splice(i, 1);
    } else if (top > window.innerHeight - 20) {
      // Missed
      score -= 5;
      scoreDisplay.textContent = "Score: " + score;
      game.removeChild(drop);
      drops.splice(i, 1);
    }
  }
}

function updateDifficulty() {
  const difficultyFactor = Math.floor(score / 100);
  let rampMultiplier = 1;

  switch (difficulty) {
    case "easy":
      rampMultiplier = 0.6;
      break;
    case "hard":
      rampMultiplier = 1.4;
      break;
    default:
      rampMultiplier = 1;
      break;
  }

  dropInterval = Math.max(baseDropInterval - difficultyFactor * 80 * rampMultiplier, minDropInterval);
  dropSpeed = Math.min(dropSpeed + difficultyFactor * 0.05 * rampMultiplier, maxDropSpeed); 
}

function gameLoop(timestamp) {
  if (timestamp - lastDropTime > dropInterval) {
    createDrop();
    lastDropTime = timestamp;
  }

  updateDrops();
  updateDifficulty();

  requestAnimationFrame(gameLoop);
}

window.addEventListener("keydown", moveBucket);
requestAnimationFrame(gameLoop);
