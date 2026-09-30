import { Player } from './player.js';
import { ObstacleManager } from './obstacles.js';
import { UI } from './ui.js';

// Fixed logical game resolution; the canvas element is scaled to fit the
// container via CSS while gameplay math always happens in these units.
// Tap-to-jump means we never need pointer coordinates, so this fixed
// resolution + CSS scaling approach stays simple across devices.
const GAME_WIDTH = 900;
const GAME_HEIGHT = 506;
const GROUND_Y = GAME_HEIGHT - 90;

// Phase 1: constant speed and spawn interval, deliberately no difficulty
// scaling yet — that arrives in Phase 2 per the build plan. Interval is
// generous enough that every obstacle is comfortably avoidable.
const RUN_SPEED = 320; // px/s
const SPAWN_INTERVAL = 1.7; // seconds

const STATE = { MENU: 'menu', PLAYING: 'playing', GAME_OVER: 'game_over' };

const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

function fitCanvas() {
  const dpr = window.devicePixelRatio || 1;
  const cssWidth = canvas.parentElement.clientWidth;
  const cssHeight = cssWidth * (GAME_HEIGHT / GAME_WIDTH);
  canvas.style.width = cssWidth + 'px';
  canvas.style.height = cssHeight + 'px';
  canvas.width = Math.round(GAME_WIDTH * dpr);
  canvas.height = Math.round(GAME_HEIGHT * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
window.addEventListener('resize', fitCanvas);
fitCanvas();

const ui = new UI();
const player = new Player(GROUND_Y);
const obstacles = new ObstacleManager(GROUND_Y, GAME_WIDTH);

let state = STATE.MENU;
let score = 0;
let distance = 0;
let lastTime = 0;

function resetGame() {
  player.reset(GROUND_Y);
  obstacles.reset();
  score = 0;
  distance = 0;
}

function startGame() {
  resetGame();
  state = STATE.PLAYING;
  ui.showGameplay();
}

function endGame() {
  state = STATE.GAME_OVER;
  ui.showGameOver(Math.floor(score));
}

function handleJumpInput(e) {
  if (e) e.preventDefault(); // stop mobile scroll/zoom on tap
  if (state === STATE.PLAYING) player.jump();
}

canvas.addEventListener('pointerdown', handleJumpInput);
window.addEventListener('keydown', (e) => {
  if (e.code === 'Space' || e.code === 'ArrowUp') handleJumpInput(e);
});

ui.onPlay(startGame);
ui.onRestart(startGame);

function drawBackground() {
  const grad = ctx.createLinearGradient(0, 0, 0, GAME_HEIGHT);
  grad.addColorStop(0, '#0b1026');
  grad.addColorStop(1, '#1a1040');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

  ctx.fillStyle = '#120a2e';
  ctx.fillRect(0, GROUND_Y, GAME_WIDTH, GAME_HEIGHT - GROUND_Y);
  ctx.strokeStyle = '#39ffce';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(0, GROUND_Y);
  ctx.lineTo(GAME_WIDTH, GROUND_Y);
  ctx.stroke();
}

function checkCollision(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

function loop(timestamp) {
  if (!lastTime) lastTime = timestamp;
  let dt = (timestamp - lastTime) / 1000;
  dt = Math.min(dt, 0.05); // clamp so a tab-switch stutter can't cause a huge physics jump
  lastTime = timestamp;

  if (state === STATE.PLAYING) {
    player.update(dt);
    obstacles.update(dt, RUN_SPEED, SPAWN_INTERVAL);

    distance += RUN_SPEED * dt;
    score = distance * 0.1;
    ui.updateScore(Math.floor(score));

    const playerBounds = player.getBounds();
    for (const o of obstacles.obstacles) {
      if (checkCollision(playerBounds, o)) {
        endGame();
        break;
      }
    }
  }

  drawBackground();
  obstacles.draw(ctx);
  player.draw(ctx);

  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);
