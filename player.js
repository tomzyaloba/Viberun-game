// Player: a small original "viber" character (hoodie, visor, sneakers, backpack).
// No copyrighted characters or imagery used anywhere here.

export class Player {
  constructor(groundY) {
    this.width = 44;
    this.height = 60;
    this.x = 80;
    this.gravity = 2200;      // px/s^2
    this.jumpVelocity = -840; // px/s
    this.reset(groundY);
  }

  reset(groundY) {
    this.groundY = groundY;
    this.y = groundY - this.height;
    this.vy = 0;
    this.isJumping = false;
    this.runFrame = 0;
    this.runTimer = 0;
  }

  jump() {
    if (!this.isJumping) {
      this.vy = this.jumpVelocity;
      this.isJumping = true;
    }
  }

  update(dt) {
    this.vy += this.gravity * dt;
    this.y += this.vy * dt;

    const floorY = this.groundY - this.height;
    if (this.y >= floorY) {
      this.y = floorY;
      this.vy = 0;
      this.isJumping = false;
    }

    if (!this.isJumping) {
      this.runTimer += dt;
      if (this.runTimer > 0.1) {
        this.runTimer = 0;
        this.runFrame = (this.runFrame + 1) % 2;
      }
    }
  }

  // Slightly inset hitbox — a hitbox exactly matching the visible sprite
  // feels unfair on near-misses (a classic runner-game gotcha), so collision
  // uses a smaller box than what's drawn.
  getBounds() {
    return {
      x: this.x + 8,
      y: this.y + 6,
      width: this.width - 16,
      height: this.height - 10,
    };
  }

  draw(ctx) {
    const { x, y, width, height } = this;
    ctx.save();
    const lean = this.isJumping ? -0.12 : 0;
    ctx.translate(x + width / 2, y + height / 2);
    ctx.rotate(lean);
    ctx.translate(-width / 2, -height / 2);

    // backpack
    ctx.fillStyle = '#0d9488';
    ctx.fillRect(-5, height * 0.3, 9, height * 0.38);

    // hoodie body
    ctx.fillStyle = '#7c3aed';
    ctx.beginPath();
    ctx.roundRect(4, height * 0.18, width - 8, height * 0.55, 10);
    ctx.fill();

    // head + visor
    ctx.fillStyle = '#1e1b4b';
    ctx.beginPath();
    ctx.roundRect(8, 0, width - 16, height * 0.3, 8);
    ctx.fill();
    ctx.fillStyle = '#22d3ee';
    ctx.shadowColor = '#22d3ee';
    ctx.shadowBlur = 8;
    ctx.fillRect(width * 0.26, height * 0.1, width * 0.48, height * 0.09);
    ctx.shadowBlur = 0;

    // legs — simple 2-frame run cycle, both planted (no lean) while airborne
    ctx.fillStyle = '#1e1b4b';
    const offset = this.isJumping ? 4 : (this.runFrame === 0 ? 7 : -7);
    ctx.fillRect(width * 0.22 + offset * 0.4, height * 0.72, width * 0.18, height * 0.26);
    ctx.fillRect(width * 0.58 - offset * 0.4, height * 0.72, width * 0.18, height * 0.26);

    // sneakers
    ctx.fillStyle = '#f472b6';
    ctx.fillRect(width * 0.22 + offset * 0.4 - 2, height * 0.92, width * 0.22, 6);
    ctx.fillRect(width * 0.58 - offset * 0.4 - 2, height * 0.92, width * 0.22, 6);

    ctx.restore();
  }
}
