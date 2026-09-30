export class UI {
  constructor() {
    this.hud = document.getElementById('hud');
    this.scoreEl = document.getElementById('hud-score');
    this.startScreen = document.getElementById('start-screen');
    this.gameOverScreen = document.getElementById('gameover-screen');
    this.finalScoreEl = document.getElementById('final-score');
    this.playBtn = document.getElementById('play-btn');
    this.restartBtn = document.getElementById('restart-btn');
  }

  onPlay(cb) {
    this.playBtn.addEventListener('click', cb);
  }

  onRestart(cb) {
    this.restartBtn.addEventListener('click', cb);
  }

  showGameplay() {
    this.startScreen.classList.add('hidden');
    this.gameOverScreen.classList.add('hidden');
    this.hud.classList.remove('hidden');
  }

  showGameOver(score) {
    this.hud.classList.add('hidden');
    this.finalScoreEl.textContent = String(score).padStart(6, '0');
    this.gameOverScreen.classList.remove('hidden');
  }

  updateScore(score) {
    this.scoreEl.textContent = 'SCORE: ' + String(score).padStart(6, '0');
  }
}
