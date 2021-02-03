export default class mainScene extends Phaser.Scene {
  constructor() {
    super({ key: "mainScene" });
  }
  preload() {
    this.load.image("player", "assets/player.png");
    this.load.image("coin", "assets/coin.png");
    this.load.image("baddie", "assets/baddie.png");
    this.load.audio("bgm", "assets/oedipus_ark_pandora.mp3");
    this.load.audio("ping", "assets/p-ping.mp3");
    this.load.audio("death", "assets/player_death.wav");
  }

  create() {
    this.input.keyboard.on(
      "keydown-" + "SPACE",
      function (event) {
        if (this.gameOver) {
          this.restart();
        }
      }.bind(this)
    );
    // deal with inits
    if (!this.bgm) {
      this.bgm = this.sound.add("bgm", { loop: true });
      this.bgmOn = true;
      this.soundOn = true;
    }

    if (this.bgmOn) {
      this.bgm.play();
    }

    this.bgmText = this.add.text(600, 20, `Bgm: ${this.bgmOn ? "on" : "off"}`, {
      font: "16px Arial",
      fill: "#fff",
    });
    this.bgmText.setInteractive(
      new Phaser.Geom.Rectangle(0, 0, this.bgmText.width, this.bgmText.height),
      Phaser.Geom.Rectangle.Contains
    );

    this.bgmText.on(
      "pointerdown",
      function () {
        if (this.bgmOn) {
          this.bgmOn = false;
          this.bgm.stop();
        } else {
          this.bgmOn = true;
          this.bgm.play();
        }
        this.bgmText.setText(`Bgm: ${this.bgmOn ? "on" : "off"}`);
      }.bind(this)
    );

    this.soundText = this.add.text(
      600,
      45,
      `Sound: ${this.bgmOn ? "on" : "off"}`,
      {
        font: "16px Arial",
        fill: "#fff",
      }
    );
    this.soundText.setInteractive(
      new Phaser.Geom.Rectangle(
        0,
        0,
        this.soundText.width,
        this.soundText.height
      ),
      Phaser.Geom.Rectangle.Contains
    );

    this.soundText.on(
      "pointerdown",
      function () {
        if (this.soundOn) {
          this.soundOn = false;
        } else {
          this.soundOn = true;
        }
        this.soundText.setText(`Sound: ${this.soundOn ? "on" : "off"}`);
      }.bind(this)
    );

    this.player = this.physics.add.sprite(100, 100, "player");
    this.coin = this.physics.add.sprite(300, 200, "coin");
    this.baddies = this.physics.add.group();

    this.score = 0;
    this.scoreText = this.add.text(20, 20, "score: " + this.score, {
      font: "20px Arial",
      fill: "#fff",
    });

    this.arrow = this.input.keyboard.createCursorKeys();

    this.player.setCollideWorldBounds(true);

    this.physics.add.collider(this.baddies, this.baddies);
    this.physics.add.overlap(this.player, this.coin, this.hit, null, this);
    this.physics.add.overlap(
      this.player,
      this.baddies,
      this.caught,
      null,
      this
    );
  }

  update(time, delta) {
    if (this.gameOver) {
      return;
    }

    if (this.arrow.right.isDown) {
      this.player.x += 3;
    } else if (this.arrow.left.isDown) {
      this.player.x -= 3;
    }

    if (this.arrow.down.isDown) {
      this.player.y += 3;
    } else if (this.arrow.up.isDown) {
      this.player.y -= 3;
    }

    this.baddies.children.iterate((baddie) => {
      var dx = this.player.x - baddie.x;
      var dy = this.player.y - baddie.y;
      var d = Math.sqrt(dx * dx + dy * dy);
      var v = 100;
      if (d != 0) {
        baddie.setVelocity((dx / d) * v, (dy / d) * v);
      }
    });
  }

  hit() {
    if (this.soundOn) {
      this.sound.play("ping");
    }
    this.coin.x = Phaser.Math.Between(100, 600);
    this.coin.y = Phaser.Math.Between(100, 200);

    this.score += 10;
    this.scoreText.setText("score: " + this.score);

    this.tweens.add({
      targets: this.player,
      duration: 200,
      scaleX: 1.2,
      scaleY: 1.2,
      yoyo: true,
    });

    if (this.score != 0 && this.score % 50 == 0) {
      var x = Math.random() < 0.5 ? this.player.x - 150 : this.player.x + 150;
      var y = Math.random() < 0.5 ? this.player.y - 50 : this.player.y + 50;
      var baddie = this.baddies.create(x, y, "baddie");
    }
  }

  caught(player) {
    if (this.soundOn) {
      this.sound.play("death");
    }
    this.bgm.stop();
    this.physics.pause();

    player.setTint(0xff0000);
    this.gameOver = true;

    var ggText = this.add.text(
      250,
      120,
      "game over\n(Click or Space to restart)",
      {
        font: "20px Arial",
        fill: "#fff",
        align: "center",
      }
    );
    ggText.setInteractive(
      new Phaser.Geom.Rectangle(0, 0, ggText.width, ggText.height),
      Phaser.Geom.Rectangle.Contains
    );

    ggText.on(
      "pointerdown",
      function () {
        this.restart();
      }.bind(this)
    );
    // this.scene.pause();
  }

  restart() {
    this.registry.destroy(); // destroy registry
    this.events.off(); // disable all active events
    this.gameOver = false;
    this.physics.resume();
    this.scene.restart(); // restart current scene
    this.player.disableBody(true, true);
    this.baddies.children.iterate((baddie) => {
      baddie.disableBody(true, true);
    });
  }
}
