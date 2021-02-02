class mainScene {
  preload() {
    this.load.image("player", "assets/player.png");
    this.load.image("coin", "assets/coin.png");
    this.load.image("baddie", "assets/baddie.png");
  }

  create() {
    this.player = this.physics.add.sprite(100, 100, "player");
    this.coin = this.physics.add.sprite(300, 200, "coin");
    this.baddies = this.physics.add.group();

    this.score = 0;
    let style = { font: "20px Arial", fill: "#fff" };
    this.scoreText = this.add.text(20, 20, "score: " + this.score, style);

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
    console.log("caught");
    this.physics.pause();

    player.setTint(0xff0000);
    this.gameOver = true;

    var ggText = this.add.text(300, 150, "game over", {
      font: "20px Arial",
      fill: "#fff",
      align: "center",
    });
    ggText.setInteractive(
      new Phaser.Geom.Rectangle(0, 0, ggText.width, ggText.height),
      Phaser.Geom.Rectangle.Contains
    );

    ggText.on(
      "pointerdown",
      function () {
        this.registry.destroy(); // destroy registry
        this.events.off(); // disable all active events
        this.gameOver = false;
        this.physics.resume();
        this.scene.restart(); // restart current scene
        this.player.disableBody(true, true);
        this.baddie.disableBody(true, true);
      }.bind(this)
    );
    // this.scene.pause();
  }

  genBaddie() {}
}

new Phaser.Game({
  width: 700,
  height: 300,
  backgroundColor: "#3498db",
  scene: mainScene,
  physics: { default: "arcade" },
  parent: "game",
});
