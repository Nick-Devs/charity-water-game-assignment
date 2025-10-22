const game = document.getElementById("game");
const bucket = document.getElementById("bucket");
const scoreDisplay = document.getElementById("score");

let score = 0;
let bucketX = window.innerWidth / 2;
let drops = [];

function createDrop() {
  const drop = document.createElement("div");
  drop.classList.add("drop");
  drop.style.left = Math.random() * (window.innerWidth - 20) + "px";
  drop.style.top = "0px";
  game.appendChild(drop);
  drops.push(drop);
}

function moveBucket(e) {
  const step = 25;
  if (e.key === "ArrowLeft" && bucketX > 0) bucketX -= step;
  if (e.key === "ArrowRight" && bucketX < window.innerWidth - 60) bucketX += step;
  bucket.style.left = bucketX + "px";
}

function updateDrops() {
  for (let i = drops.length - 1; i >= 0; i--) {
    const drop = drops[i];
    let top = parseFloat(drop.style.top);
    top += 5;
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
    } else if (top > window.innerHeight - 20) {
      // missed
      score -= 5;
      scoreDisplay.textContent = "Score: " + score;
      game.removeChild(drop);
      drops.splice(i, 1);
    }
  }
}

function gameLoop() {
  if (Math.random() < 0.05) createDrop();
  updateDrops();
  requestAnimationFrame(gameLoop);
}

window.addEventListener("keydown", moveBucket);
gameLoop();
