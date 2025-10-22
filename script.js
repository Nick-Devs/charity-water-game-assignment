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
let maxDropSpeed = 3;

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
  default:
    baseDropInterval = 5000;
    dropSpeed = 1;
    break;
}

dropInterval = baseDropInterval;

function getRelativeWidth(px) {
  return (px / 1920) * window.innerWidth; 
}

function getRelativeHeight(px) {
  return (px / 1080) * window.innerHeight;
}

function createDrop() {
  const drop = document.createElement("div");
  drop.classList.add("drop");

  const dropSize = getRelativeWidth(20);
  drop.style.width = `${dropSize}px`;
  drop.style.height = `${dropSize}px`;
  drop.style.left = Math.random() * (window.innerWidth - dropSize) + "px";
  drop.style.top = "0px";

  game.appendChild(drop);
  drops.push(drop);
}

function moveBucket(e) {
  const step = getRelativeWidth(20); // scale with screen size
  const bucketWidth = bucket.offsetWidth;

  if (e.key === "ArrowLeft" && bucketX > 0) bucketX -= step;
  if (e.key === "ArrowRight" && bucketX < window.innerWidth - bucketWidth) bucketX += step;

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
      // caught
      score += 10;
      scoreDisplay.textContent = "Score: " + score;
      game.removeChild(drop);
      drops.splice(i, 1);
    } else if (top > window.innerHeight - getRelativeHeight(20)) {
      // missed
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

  dropInterval = Math.max(
    baseDropInterval - difficultyFactor * 800 * rampMultiplier,
    minDropInterval
  );

  dropSpeed = Math.min(
    1 + difficultyFactor * 0.2 * rampMultiplier,
    maxDropSpeed
  );
}

// ✅ Main loop
function gameLoop(timestamp) {
  if (timestamp - lastDropTime > dropInterval) {
    createDrop();
    lastDropTime = timestamp;
  }

  updateDrops();
  updateDifficulty();
  requestAnimationFrame(gameLoop);
}

// ✅ Handle resizing (keep bucket visible)
window.addEventListener("resize", () => {
  bucketX = Math.min(bucketX, window.innerWidth - bucket.offsetWidth);
  bucket.style.left = bucketX + "px";
});

window.addEventListener("keydown", moveBucket);
requestAnimationFrame(gameLoop);
