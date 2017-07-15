/*
 *  @constructor Sprite
 *
 *  Create new sprite entities
 */
var Sprite = function(options) {
  var context = options.context;
  var location = new function() {
    this.x = options.location.x;
    this.y = options.location.y;
  }
  var width = options.width;
  var height = options.height;
  var image = new Image();
  var render = function(canvasX, canvasY, spriteWidth, spriteHeight) {
    context.drawImage(image, location.x, location.y, width, height, canvasX, canvasY, spriteWidth, spriteHeight);
  };

  image.src = options.image;

  return {
    context: context,
    width: width,
    height: height,
    image: image,
    render: render
  }
}

var canvas = new function() {
  this.element = document.getElementById("game");
  this.context = this.element.getContext("2d");
  this.width = 1000;
  this.height = 500;
  this.render = function() {
    canvas.element.width = canvas.width;
    canvas.element.height = canvas.height;
  }
}

var sound = new function() {
  this.jumpSmall = document.getElementById("jump-small");
}

var util = new function() {
  this.math = new function() {
    /*
     *  @function round
     *
     *  Round input to one decimal place
     */
    this.round = function(input) {
      return Math.round(input * 10) / 10;
    }
  }
}

var player = new function() { // change this to entity and make it a class
  this.width = 34;
  this.height = 64;
  this.x = canvas.width / 2;
  this.y = canvas.height - this.height;
  this.speed = 3;
  this.jumpHeight = 11.5;
  this.velocity = new function() {
    this.x = 0;
    this.y = 0;
  }
  this.friction = 0.2;
  this.gravity = 0.4;
  this.state = new function() {
    this.jumping = false;
    this.standing = true;
    this.direction = "RIGHT";
    this.walking = false;
  }
  this.keysPressed = [];
  this.previous = new function() {
    this.velocity = new function() {
      this.x;
      this.y;
    }
  }

  this.sprite = new function() {

    this.standing = new function() {
      this.right = new Sprite({
        context: canvas.context,
        width: 17,
        height: 32,
        location: {
          x: 257,
          y: 1
        },
        image: "sprites/characters.gif"
      });
      this.left = new Sprite({
        context: canvas.context,
        width: 17,
        height: 32,
        location: {
          x: 239,
          y: 1
        },
        image: "sprites/characters.gif"
      });
    }
    
    this.jumping = new function() {
      this.right = new Sprite({
        context: canvas.context,
        width: 17,
        height: 32,
        location: {
          x: 369,
          y: 1
        },
        image: "sprites/characters.gif"
      });
      this.left = new Sprite({
        context: canvas.context,
        width: 17,
        height: 32,
        location: {
          x: 128,
          y: 1
        },
        image: "sprites/characters.gif"
      });
    }
    
    this.walking = new function() {

      this.right = new function() {
        this.frame = [
          new Sprite({
            context: canvas.context,
            width: 17,
            height: 32,
            location: {
              x: 295,
              y: 1
            },
            image: "sprites/characters.gif"
          }),
          new Sprite({
            context: canvas.context,
            width: 17,
            height: 32,
            location: {
              x: 128,
              y: 1
            },
            image: "sprites/characters.gif"
          }),
          new Sprite({
            context: canvas.context,
            width: 17,
            height: 32,
            location: {
              x: 128,
              y: 1
            },
            image: "sprites/characters.gif"
          }),
        ];
      };

      this.left = new function() {
        this.frame = [
          new Sprite({
            context: canvas.context,
            width: 17,
            height: 32,
            location: {
              x: 201,
              y: 1
            },
            image: "sprites/characters.gif"
          }),
          new Sprite({
            context: canvas.context,
            width: 17,
            height: 32,
            location: {
              x: 166,
              y: 1
            },
            image: "sprites/characters.gif"
          }),
          new Sprite({
            context: canvas.context,
            width: 17,
            height: 32,
            location: {
              x: 184,
              y: 1
            },
            image: "sprites/characters.gif"
          })
        ];
      };
    }
    
  }

  this.checkInput = function() {
    player.state.walking = false;

    if (player.keysPressed[38]) { // up arrow
      if(!player.state.jumping){
        player.state.jumping = true;
        player.velocity.y = -player.jumpHeight;
        sound.jumpSmall.pause();
        sound.jumpSmall.currentTime = 0;
        sound.jumpSmall.play();
      }
    }
    if (player.keysPressed[39]) { // right arrow
      player.state.walking = true;
      player.state.direction = "RIGHT";
      if (player.velocity.x < player.speed) {                         
        player.velocity.x++;                  
      }          
    }          
    if (player.keysPressed[37]) { // left arrow 
      player.state.walking = true;
      player.state.direction = "LEFT";                        
      if (player.velocity.x > -player.speed) {
         player.velocity.x--;
      }
    }
  }

  this.move = function() {
    player.x = player.x + player.velocity.x;
    player.y = player.y + player.velocity.y;

    //prevent out of bounds movement
    if (player.x >= (canvas.width - player.width)) {
      player.x = canvas.width - player.width;
    } else if (player.x <= 0) {
      player.x = 0;
    }

    if(player.y >= (canvas.height - player.height)) {
      player.y = canvas.height - player.height;
      player.state.jumping = false;
    }
  }

  this.applyFriction = function() {
    if(!player.state.walking) {
      player.previous.velocity.x = player.velocity.x;
      player.velocity.x = util.math.round(player.velocity.x * player.friction);
    }
    // catch math errors, if velocity has stopped growing or dropping player is no longer moving
    if(player.previous.velocity.x == player.velocity.x) player.velocity.x = 0;
  }

  this.applyGravity = function() {
    player.previous.velocity.y = player.velocity.y;
    if(player.state.jumping) {
      player.velocity.y = player.velocity.y + player.gravity;
    }
    // catch errors math errors, if velocity has stopped growing or dropping player is no longer moving
    if(player.previous.velocity.y == player.velocity.y) player.velocity.y = 0;
  }

  this.setState = function() {
    //player.state.walking = Boolean(player.velocity.x != 0);
    player.state.standing = !player.state.jumping && !player.state.walking;
    
    player.state.jumping; // this state is set by player.move & player.input.up
    player.state.direction; // this state is set by player.input.left & player.input.right
  }

  this.draw = function() {
    var playerSprite;
    if(player.state.jumping) {
      if(player.state.direction == "RIGHT") {
        playerSprite = player.sprite.jumping.right;
      } else if (player.state.direction == "LEFT") {
        playerSprite = player.sprite.jumping.left;
      }
    } else {
      if(player.state.standing) {
        if(player.state.direction == "RIGHT") {
          playerSprite = player.sprite.standing.right;
        } else if (player.state.direction == "LEFT") {
          playerSprite = player.sprite.standing.left;
        }
      } else if(player.state.walking) {
        if(player.state.direction == "RIGHT") {
          playerSprite = player.sprite.walking.right.frame[0];
        } else if(player.state.direction == "LEFT") {
          playerSprite = player.sprite.walking.left.frame[0];
        }
      }
    }
    playerSprite.render(player.x, player.y, player.width, player.height);
  }

  this.render = function() {
    canvas.context.clearRect(0, 0, canvas.width, canvas.height);
    player.checkInput();
    player.applyFriction();
    player.applyGravity();
    player.move();
    player.setState();
    player.draw();
    requestAnimationFrame(player.render);
  }
}

window.addEventListener("load", function(){
  canvas.render();
  player.render();
});

document.body.addEventListener("keydown", function(event) {
  player.keysPressed[event.keyCode] = true;
});

document.body.addEventListener("keyup", function(event) {
  player.keysPressed[event.keyCode] = false;
});