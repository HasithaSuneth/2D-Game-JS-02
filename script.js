window.addEventListener("load", function () {
  loading.style.display = "none";
  const canvas = document.getElementById("canvas1");
  canvas.style.visibility = "visible";
  const ctx = canvas.getContext("2d");
  canvas.width = 1000;
  canvas.height = 500;

  class InputHandler {
    constructor(game) {
      this.game = game;
      window.addEventListener("keydown", (e) => {
        if (
          (e.key === "ArrowDown" || e.key === "ArrowUp") &&
          this.game.keys.indexOf(e.key) === -1
        ) {
          this.game.keys.push(e.key);
        } else if (e.key === " ") {
          this.game.player.shootTop();
        } else if (e.key === "d") {
          this.game.debug = !this.game.debug;
        } else if (e.key === "Enter") document.location.reload(true);
      });
      window.addEventListener("keyup", (e) => {
        if (e.key === "ArrowDown" || e.key === "ArrowUp") {
          this.game.keys.splice(this.game.keys.indexOf(e.key), 1);
        }
      });
      // window.addEventListener("touchmove", (e) => {
      //   const touchY = "";
      //   const touchTreshold = 200;
      //   const swipeDistanceY = e.changedTouches[0].pageY - touchY;
      //   if (swipeDistanceY > touchTreshold) document.location.reload(true);
      // });
      window.addEventListener("touchstart", (e) => {
        this.touchY = e.changedTouches[0].pageY;
        this.touchX = e.changedTouches[0].pageX;
        this.boundX = this.game.boundingBox.x;
        this.boundY = this.game.boundingBox.y;
        this.boundWidth = this.game.boundingBox.width;
        this.boundHeight = this.game.boundingBox.height;
        // FireKey
        if (
          this.touchX >=
            this.boundX + this.boundWidth - this.boundWidth / 3.7 &&
          this.touchX <=
            this.boundX + this.boundWidth - this.boundWidth / 10.5 &&
          this.touchY <= this.boundY + this.boundHeight &&
          this.touchY >= this.boundY + this.boundHeight - this.boundHeight / 3.3
        ) {
          this.game.player.shootTop();
        }
        // DownKey
        if (
          this.touchX >= this.boundX + this.boundWidth / 15 &&
          this.touchX <= this.boundX + this.boundWidth / 4.3 &&
          this.touchY <= this.boundY + this.boundHeight &&
          this.touchY >=
            this.boundY + this.boundHeight - this.boundHeight / 4.5 &&
          this.game.keys.indexOf("ArrowDown") === -1
        ) {
          this.game.keys.push("ArrowDown");
        }
        // UpKey
        if (
          this.touchX >= this.boundX + this.boundWidth / 15 &&
          this.touchX <= this.boundX + this.boundWidth / 4.3 &&
          this.touchY <=
            this.boundY + this.boundHeight - this.boundHeight / 4 &&
          this.touchY >=
            this.boundY + this.boundHeight - this.boundHeight / 2 &&
          this.game.keys.indexOf("ArrowUp") === -1
        ) {
          this.game.keys.push("ArrowUp");
        }
      });
      window.addEventListener("touchend", (e) => {
        this.game.keys.splice(this.game.keys.indexOf("ArrowUp"), 1);
        this.game.keys.splice(this.game.keys.indexOf("ArrowDown"), 1);
      });
    }
  }

  class Mobile {
    constructor(game) {
      this.game = game;
      this.width = 80;
      this.height = 80;
      this.upImage = upKey;
      this.downImage = downKey;
      this.fireImage = fireKey;
    }
    draw(context) {
      context.drawImage(
        this.upImage,
        100,
        this.game.height - 200,
        this.width,
        this.height
      );
      context.drawImage(
        this.downImage,
        100,
        this.game.height - 100,
        this.width,
        this.height
      );
      context.drawImage(
        this.fireImage,
        this.game.width - 200,
        this.game.height - 100,
        this.width,
        this.height
      );
    }
  }

  class Sound {
    constructor() {
      // this.fireSnd = new Audio("./sounds/fire2.wav");
      this.fireSnd = new Audio("./sounds/fire.wav");
      this.energySnd = new Audio("./sounds/energy.wav");
      this.desHive = new Audio("./sounds/rlaunch.wav");
      this.desAll = new Audio("./sounds/destroy.wav");
      // this.hitAll = new Audio("./sounds/boom.wav");
      this.hitAll = new Audio("./sounds/gethit.wav");
      this.wonSnd = new Audio("./sounds/won.wav");
      this.loseSnd = new Audio("./sounds/lose.wav");
    }
    fireSound() {
      this.fireSnd.play();
    }
    energyGainSound() {
      this.energySnd.play();
    }
    destroyHiveSound() {
      this.desHive.play();
    }
    destroyEnemySound() {
      this.desAll.play();
    }
    hitEnemySound() {
      this.hitAll.play();
    }
    winGameSound() {
      this.wonSnd.play();
    }
    loseGameSound() {
      this.loseSnd.play();
    }
  }

  class Projectile {
    constructor(game, x, y) {
      this.game = game;
      this.x = x;
      this.y = y;
      this.width = 10;
      this.height = 3;
      this.speed = 3;
      this.markedForDeletion = false;
      this.image = projectile;
    }
    update() {
      this.x += this.speed;
      if (this.x > this.game.width * 0.8) this.markedForDeletion = true;
    }
    draw(context) {
      context.drawImage(this.image, this.x, this.y);
    }
  }

  class Particle {
    constructor(game, x, y) {
      this.game = game;
      this.x = x;
      this.y = y;
      this.image = gears;
      this.frameX = Math.floor(Math.random() * 3);
      this.frameY = Math.floor(Math.random() * 3);
      this.spriteSize = 50;
      this.sizeModifier = (Math.random() * 0.5 + 0.5).toFixed(1);
      this.size = this.spriteSize * this.sizeModifier;
      this.speedX = Math.random() * 6 - 3;
      this.speedY = Math.random() * -15;
      this.gravity = 0.5;
      this.markedForDeletion = false;
      this.angle = 0;
      this.va = Math.random() * 0.2 - 0.1;
      this.bounced = 0;
      this.bottomBounceBoundary = Math.random() * 80 + 60;
    }
    update() {
      this.angle += this.va;
      this.speedY += this.gravity;
      this.x -= this.speedX + this.game.speed;
      this.y += this.speedY;
      if (this.y > this.game.height + this.size || this.x < 0 - this.size)
        this.markedForDeletion = true;
      if (
        this.y > this.game.height - this.bottomBounceBoundary &&
        this.bounced < 2
      ) {
        this.bounced++;
        this.speedY *= -0.7;
      }
    }
    draw(context) {
      context.save();
      context.translate(this.x, this.y);
      context.rotate(this.angle);
      context.drawImage(
        this.image,
        this.frameX * this.spriteSize,
        this.frameY * this.spriteSize,
        this.spriteSize,
        this.spriteSize,
        this.size * -0.5,
        this.size * -0.5,
        this.size,
        this.size
      );
      context.restore();
    }
  }

  class Player {
    constructor(game) {
      this.game = game;
      this.width = 120;
      this.height = 190;
      this.x = 20;
      this.y = 100;
      this.frameX = 0;
      this.frameY = 0;
      this.maxFrame = 37;
      this.speedY = 0;
      this.maxSpeed = 3;
      this.projectiles = [];
      this.image = player;
      this.powerUp = false;
      this.powerUpTimer = 0;
      this.powerUpLimit = 10000;
    }
    update(deltaTime) {
      if (this.game.keys.includes("ArrowUp")) this.speedY = -this.maxSpeed;
      else if (this.game.keys.includes("ArrowDown"))
        this.speedY = this.maxSpeed;
      else this.speedY = 0;
      this.y += this.speedY;
      // vertical boundaries
      if (this.y > this.game.height - this.height * 0.5)
        this.y = this.game.height - this.height * 0.5;
      else if (this.y < -this.height * 0.5) this.y = -this.height * 0.5;
      // handle projectiles
      this.projectiles.forEach((projectile) => {
        projectile.update();
      });
      this.projectiles = this.projectiles.filter(
        (projectile) => !projectile.markedForDeletion
      );
      // Sprite animation
      if (this.frameX < this.maxFrame) {
        this.frameX++;
      } else {
        this.frameX = 0;
      }
      // Power up
      if (this.powerUp) {
        if (this.powerUpTimer > this.powerUpLimit) {
          this.powerUpTimer = 0;
          this.powerUp = false;
          this.frameY = 0;
        } else {
          this.powerUpTimer += deltaTime;
          this.frameY = 1;
          this.game.ammo += 0.1;
        }
      }
    }
    draw(context) {
      if (this.game.debug)
        context.strokeRect(this.x, this.y, this.width, this.height);
      this.projectiles.forEach((projectile) => {
        projectile.draw(context);
      });
      context.drawImage(
        this.image,
        this.frameX * this.width,
        this.frameY * this.height,
        this.width,
        this.height,
        this.x,
        this.y,
        this.width,
        this.height
      );
    }
    shootTop() {
      if (this.game.ammo > 0) {
        this.projectiles.push(
          new Projectile(this.game, this.x + 80, this.y + 30)
        );
        this.game.ammo--;
      }
      if (this.powerUp) this.shootBottom();
      this.game.sound.fireSound();
    }
    shootBottom() {
      if (this.game.ammo > 0) {
        this.projectiles.push(
          new Projectile(this.game, this.x + 80, this.y + 175)
        );
      }
    }
    enterPowerUp() {
      this.powerUpTimer = 0;
      this.powerUp = true;
      if (this.game.ammo < this.game.maxAmmo)
        this.game.ammo = this.game.maxAmmo;
    }
  }

  class Enemy {
    constructor(game) {
      this.game = game;
      this.x = this.game.width;
      this.speedX = Math.random() * -1.5 - 1.5;
      this.markedForDeletion = false;

      this.frameX = 0;
      this.frameY = 0;
      this.maxFrame = 37;
    }
    update() {
      this.x += this.speedX - this.game.speed;
      if (this.x + this.width < 0) this.markedForDeletion = true;
      if (this.frameX < this.maxFrame) {
        this.frameX++;
      } else {
        this.frameX = 0;
      }
    }
    draw(context) {
      if (this.game.debug)
        context.strokeRect(this.x, this.y, this.width, this.height);
      context.drawImage(
        this.image,
        this.frameX * this.width,
        this.frameY * this.height,
        this.width,
        this.height,
        this.x,
        this.y,
        this.width,
        this.height
      );
      if (this.game.debug) {
        context.font = "20px Helvetica";
        context.fillText(this.lives, this.x, this.y);
      }
    }
  }

  class Angler1 extends Enemy {
    constructor(game) {
      super(game);
      this.width = 228;
      this.height = 169;
      this.y = Math.random() * (this.game.height * 0.95 - this.height);
      this.image = angler1;
      this.frameY = Math.floor(Math.random() * 3);
      this.lives = 5;
      this.score = this.lives;
    }
  }

  class Angler2 extends Enemy {
    constructor(game) {
      super(game);
      this.width = 213;
      this.height = 165;
      this.y = Math.random() * (this.game.height * 0.95 - this.height);
      this.image = angler2;
      this.frameY = Math.floor(Math.random() * 2);
      this.lives = 6;
      this.score = this.lives;
    }
  }

  class LuckyFish extends Enemy {
    constructor(game) {
      super(game);
      this.width = 99;
      this.height = 95;
      this.y = Math.random() * (this.game.height * 0.95 - this.height);
      this.image = lucky;
      this.frameY = Math.floor(Math.random() * 2);
      this.lives = 5;
      this.score = 15;
      this.type = "lucky";
    }
  }

  class HiveWhale extends Enemy {
    constructor(game) {
      super(game);
      this.width = 400;
      this.height = 227;
      this.y = Math.random() * (this.game.height * 0.95 - this.height);
      this.image = hivewhale;
      this.frameY = 0;
      this.lives = 20;
      this.score = this.lives;
      this.type = "hive";
      this.speedX = Math.random() * -1.2 - 0.2;
    }
  }

  class Drone extends Enemy {
    constructor(game, x, y) {
      super(game);
      this.width = 115;
      this.height = 95;
      this.x = x;
      this.y = y;
      this.image = drone;
      this.frameY = Math.floor(Math.random() * 2);
      this.lives = 3;
      this.score = this.lives;
      this.type = "drone";
      this.speedX = Math.random() * -4.2 - 0.5;
    }
  }

  class Layer {
    constructor(game, image, speedModifier) {
      this.game = game;
      this.image = image;
      this.speedModifier = speedModifier;
      this.width = 1768;
      this.height = 500;
      this.x = 0;
      this.y = 0;
    }
    update() {
      if (this.x <= -this.width) this.x = 0;
      this.x -= this.game.speed * this.speedModifier;
    }
    draw(context) {
      context.drawImage(this.image, this.x, this.y);
      context.drawImage(this.image, this.x + this.width, this.y);
    }
  }

  class Background {
    constructor(game) {
      this.game = game;
      this.image1 = layer1img;
      this.image2 = layer2img;
      this.image3 = layer3img;
      this.image4 = layer4img;
      this.layer1 = new Layer(this.game, this.image1, 0.2);
      this.layer2 = new Layer(this.game, this.image2, 0.4);
      this.layer3 = new Layer(this.game, this.image3, 0.8);
      this.layer4 = new Layer(this.game, this.image4, 1);
      this.layers = [this.layer1, this.layer2, this.layer3];
    }
    update() {
      this.layers.forEach((layer) => layer.update());
    }
    draw(context) {
      this.layers.forEach((layer) => layer.draw(context));
    }
  }

  class Explosion {
    constructor(game, x, y) {
      this.game = game;
      this.x = x;
      this.y - y;
      this.frameX = 0;
      this.spriteWidth = 200;
      this.spriteHeight = 200;
      this.width = this.spriteWidth;
      this.height = this.spriteHeight;
      this.x = x - this.width * 0.5;
      this.y = y - this.height * 0.5;
      this.fps = 30;
      this.timer = 0;
      this.interval = 1000 / this.fps;
      this.markedForDeletion = false;
    }
    update(deltaTime) {
      this.x -= this.game.speed;
      if (this.timer > this.interval) {
        this.frameX++;
        this.timer = 0;
      } else {
        this.timer += deltaTime;
      }
      if (this.frameX > this.maxFrame) this.markedForDeletion = true;
    }
    draw(context) {
      context.drawImage(
        this.image,
        this.frameX * this.spriteWidth,
        0,
        this.spriteWidth,
        this.spriteHeight,
        this.x,
        this.y,
        this.width,
        this.height
      );
    }
  }

  class SmokeExplosion extends Explosion {
    constructor(game, x, y) {
      super(game, x, y);
      this.image = smokeExplosion;
    }
  }

  class FireExplosion extends Explosion {
    constructor(game, x, y) {
      super(game, x, y);
      this.image = fireExplosion;
    }
  }

  class UI {
    constructor(game) {
      this.game = game;
      this.fontSize = 25;
      this.fontFamily = "Bangers";
      this.color = "white";
    }
    draw(context) {
      context.save();
      context.fillStyle = this.color;
      context.shadowOffsetX = 2;
      context.shadowOffsetY = 2;
      context.shadowColor = "black";
      context.font = this.fontSize + "px " + this.fontFamily;
      // Score
      context.fillText(
        "Score: " + this.game.score + " / " + this.game.winnigScore,
        20,
        40
      );
      // Timer
      // const formattedTime = (this.game.gameTime * 0.001).toFixed(1);
      let formattedTime = (
        (this.game.timeLimit - this.game.gameTime) *
        0.001
      ).toFixed(1);
      if (formattedTime <= 0) formattedTime = 0;
      context.fillText("Timer: " + formattedTime, 20, 100);
      // Game over message
      if (this.game.gameOver) {
        context.textAlign = "center";
        let message1;
        let message2;
        let message3;
        if (this.game.score > this.game.winnigScore) {
          message1 = "Most Wondrous!";
          message2 = "Well done explorer";
          if (!this.game.isMobileDevice) message3 = "Press 'Enter' to restart";
          else message3 = "Swipe down to restart";
          if (this.game.soundTimer) {
            this.game.sound.winGameSound();
            this.game.soundTimer = false;
          }
        } else {
          message1 = "Blazes!";
          message2 = "Get my repair kit and try again!";
          if (!this.game.isMobileDevice) message3 = "Press 'Enter' to restart";
          else message3 = "Swipe down to restart";
          if (this.game.soundTimer) {
            this.game.sound.loseGameSound();
            this.game.soundTimer = false;
          }
        }
        context.font = "70px " + this.fontFamily;
        context.fillText(
          message1,
          this.game.width * 0.5,
          this.game.height * 0.5 - 20
        );
        context.font = "25px " + this.fontFamily;
        context.fillText(
          message2,
          this.game.width * 0.5,
          this.game.height * 0.5 + 20
        );
        context.font = "20px " + this.fontFamily;
        context.fillText(
          message3,
          this.game.width * 0.5,
          this.game.height * 0.5 + 100
        );
      }
      // Ammo
      if (this.game.player.powerUp) context.fillStyle = "#ffffbd";
      for (let i = 0; i < this.game.ammo; i++) {
        context.fillRect(20 + 5 * i, 50, 3, 20);
      }
      context.restore();
    }
  }

  class Game {
    constructor(width, height) {
      this.width = width;
      this.height = height;
      this.isMobileDevice = window.matchMedia(
        "only screen and (max-width: 1000px)"
      ).matches;
      this.boundingBox = canvas.getBoundingClientRect();
      this.player = new Player(this);
      this.input = new InputHandler(this);
      this.ui = new UI(this);
      this.background = new Background(this);
      this.mobile = new Mobile(this);
      this.sound = new Sound();
      this.keys = [];
      this.enemies = [];
      this.particles = [];
      this.explosions = [];
      this.enemyTimer = 0;
      this.enemyInterval = 1700;
      this.ammo = 20;
      this.maxAmmo = 50;
      this.ammoTimer = 0;
      this.ammoInterval = 350;
      this.gameOver = false;
      this.score = 0;
      this.winnigScore = 250;
      this.gameTime = 0;
      this.timeLimit = 40000;
      this.speed = 1;
      this.debug = false;
      this.soundTimer = true;
    }
    update(deltaTime) {
      if (!this.gameover) this.gameTime += deltaTime;
      if (this.gameTime > this.timeLimit) this.gameOver = true;
      this.background.update();
      this.background.layer4.update();
      this.player.update(deltaTime);
      if (this.ammoTimer > this.ammoInterval) {
        if (this.ammo < this.maxAmmo) this.ammo++;
        this.ammoTimer = 0;
      } else {
        this.ammoTimer += deltaTime;
      }
      // Particles
      this.particles.forEach((particle) => particle.update());
      this.particles = this.particles.filter(
        (particle) => !particle.markedForDeletion
      );
      // Explosion
      this.explosions.forEach((explosion) => explosion.update(deltaTime));
      this.explosions = this.explosions.filter(
        (explosion) => !explosion.markedForDeletion
      );
      // Enemy collision
      this.enemies.forEach((enemy) => {
        enemy.update();
        // Player hit
        if (this.checkCollision(this.player, enemy)) {
          enemy.markedForDeletion = true;
          this.addExplosion(enemy);
          for (let i = 0; i < enemy.score; i++) {
            this.particles.push(
              new Particle(
                this,
                enemy.x + enemy.width * 0.5,
                enemy.y + enemy.height * 0.5
              )
            );
          }
          if (enemy.type === "lucky") {
            this.player.enterPowerUp();
            this.sound.energyGainSound();
          } else if (!this.gameOver) {
            this.score--;
            this.sound.hitEnemySound();
          }
        }
        // Fire hit
        this.player.projectiles.forEach((projectile) => {
          if (this.checkCollision(projectile, enemy)) {
            enemy.lives--;
            projectile.markedForDeletion = true;
            this.particles.push(
              new Particle(
                this,
                enemy.x + enemy.width * 0.5,
                enemy.y + enemy.height * 0.5
              )
            );
            if (enemy.lives <= 0) {
              for (let i = 0; i < enemy.score; i++) {
                this.particles.push(
                  new Particle(
                    this,
                    enemy.x + enemy.width * 0.5,
                    enemy.y + enemy.height * 0.5
                  )
                );
              }

              enemy.markedForDeletion = true;
              this.addExplosion(enemy);
              if (enemy.type === "hive") {
                this.sound.destroyHiveSound();
                for (let i = 0; i < 5; i++) {
                  this.enemies.push(
                    new Drone(
                      this,
                      enemy.x + Math.random() * enemy.width,
                      enemy.y + Math.random() * enemy.height * 0.5
                    )
                  );
                }
              } else {
                this.sound.destroyEnemySound();
              }
              if (!this.gameOver) this.score += enemy.score;
              //   if (this.score > this.winnigScore) this.gameOver = true;
            }
          }
        });
      });
      this.enemies = this.enemies.filter((enemy) => !enemy.markedForDeletion);
      if (this.enemyTimer > this.enemyInterval && !this.gameOver) {
        this.addEnemy();
        this.enemyTimer = 0;
      } else {
        this.enemyTimer += deltaTime;
      }
    }
    draw(context) {
      this.background.draw(context);
      this.ui.draw(context);
      this.player.draw(context);
      this.particles.forEach((particle) => particle.draw(context));
      this.enemies.forEach((enemy) => {
        enemy.draw(context);
      });
      this.explosions.forEach((explosion) => {
        explosion.draw(context);
      });
      this.background.layer4.draw(context);
      if (this.isMobileDevice) this.mobile.draw(context);
    }
    addEnemy() {
      const randomize = Math.random();
      if (randomize < 0.3) this.enemies.push(new Angler1(this));
      else if (randomize < 0.5) this.enemies.push(new Angler2(this));
      else if (randomize < 0.8) this.enemies.push(new HiveWhale(this));
      else this.enemies.push(new LuckyFish(this));
    }
    addExplosion(enemy) {
      const randomize = Math.random();
      if (randomize < 0.5) {
        this.explosions.push(
          new SmokeExplosion(
            this,
            enemy.x + enemy.width * 0.5,
            enemy.y + enemy.height * 0.5
          )
        );
      } else {
        this.explosions.push(
          new FireExplosion(
            this,
            enemy.x + enemy.width * 0.5,
            enemy.y + enemy.height * 0.5
          )
        );
      }
    }
    checkCollision(rect1, rect2) {
      return (
        rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.y + rect1.height > rect2.y
      );
    }
  }

  const game = new Game(canvas.width, canvas.height);
  let lastTime = 0;

  function animate(timeStamp) {
    const deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    game.draw(ctx);
    game.update(deltaTime);
    requestAnimationFrame(animate);
  }
  animate(0);
});
