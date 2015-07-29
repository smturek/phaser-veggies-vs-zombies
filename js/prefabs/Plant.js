var Veggies = Veggies || {};

Veggies.Plant = function(state, x, y, data) {
  Phaser.Sprite.call(this, state.game, x, y, data.plantAsset);

  this.state = state;
  this.game = state.game;
  this.bullets = state.bullets;
  this.suns = state.suns;

  this.anchor.setTo(0.5);

  //init physics body
  this.game.physics.arcade.enable(this);
  this.body.immovable = true;

  //create timers
  this.shootingTimer = this.game.time.create(false);
  this.producingTimer = this.game.time.create(false);

  this.reset(x, y, data);
};

Veggies.Plant.prototype = Object.create(Phaser.Sprite.prototype);
Veggies.Plant.prototype.constructor = Veggies.Plant;

Veggies.Plant.prototype.reset = function(x, y, data){
  Phaser.Sprite.prototype.reset.call(this, x, y, data.health);

  //change the image of the plant
  this.loadTexture(data.plantAsset);

  this.animationName = null;
  if(data.animationFrames) {
    this.animationName = data.plantAsset + 'Anim';
    this.animations.add(this.animationName, data.animationFrames, 6, false);
    this.play(this.animationName);
  }

  this.isShooter = data.isShooter;
  this.isSunProducer = data.isSunProducer;

  if(this.isShooter) {
      this.shootingTimer.start();
      this.scheduleShooting();
  }

  if(this.isSunProducer) {
      this.producingTimer.start();
      this.scheduleProduction();
  }
};

Veggies.Plant.prototype.kill = function() {
    Phaser.Sprite.prototype.kill.call(this);

    this.shootingTimer.stop();
    this.producingTimer.stop();
};

Veggies.Plant.prototype.scheduleShooting = function() {
    this.shoot();

    //plants shoot once per second
    this.shootingTimer.add(Phaser.Timer.SECOND, this.scheduleShooting, this);
};

Veggies.Plant.prototype.scheduleProduction = function() {
    this.produceSun();

    //plants shoot once per second
    this.producingTimer.add(Phaser.Timer.SECOND * 5, this.scheduleProduction, this);
};

Veggies.Plant.prototype.shoot = function() {
    //play shooting animation
    if(this.animations.getAnimation(this.animationName)) {
        this.play(this.animationName);
    }

    //location y of the bullet
    var y = this.y - 10;
    var newElement = this.bullets.getFirstDead();

    if(!newElement) {
        newElement = new Veggies.Bullet(this, this.x, y);
        this.bullets.add(newElement);
    }
    else {
        newElement.reset(this.x, y);
    }

    newElement.body.velocity.x = 100;
};

Veggies.Plant.prototype.produceSun = function() {
    var diffX = -40 + Math.random() * 80;
    var diffY = -40 + Math.random() * 80;

    this.state.createSun(this.x + diffX, this.y + diffY);
};
