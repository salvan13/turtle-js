addEventListener("load", function() {

  //objects behaivor (called pre frame-update)
  var objBehaviorPre = function(dt) {
    this.x += this.sx * dt;
  };

  //objects behaivor (called post frame-update)
  var objBehaviorPost = function(dt) {
    if(this.id == 'player') {
      if (Turtle.controls.isKeyPressed(Turtle.keyCodes.RIGHT)) {
        this.sx = 10;
      }
      if(Turtle.controls.isKeyPressed(Turtle.keyCodes.LEFT)) {
        this.sx = -10;
      }
    }
  };
  
  //initialize the game
  Turtle.init({
    container: '#game',
    block: 64,
    height: 20,
    width: 30,
    objectBehavior: {pre: objBehaviorPre, post: objBehaviorPost}
  });
  
  //create the main scene
  var main = new Turtle.Scene('main');
  
  //create the player
  var player = new Turtle.Object('player', {
    x: 300,
    y:300
  });
  
  //put the player in the scene, the scene in the game, and run the scene
  main.addObject(player);
  Turtle.addScene(main);
  Turtle.runScene('main');

}, false);


