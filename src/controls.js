Turtle.controls = (function(){

  var keyCodes = {
    ENTER: 13, SHIFT: 16, CTRL: 17, ALT: 18, ESC: 27, LEFT: 37, UP: 38, RIGHT: 39, DOWN: 40, SPACE: 32,
    TAB: 29, BACKSPACE: 28, Z: 90, X: 88, C: 67, P: 80, S: 83, A:65, D: 68, W: 87, Q: 81, E: 69, R: 82, F: 70
  };

  Turtle.keyCodes = keyCodes;

  var keypressed = {};

  window.addEventListener('keydown', function(e) {
    keypressed[e.keyCode] = true;
  }, false);

  window.addEventListener('keyup', function(e) {
    if(keypressed[e.keyCode]) {
      delete keypressed[e.keyCode];
    }
  }, false);

  var isKeyPressed = function(code) {
    return !!keypressed[code];
  };

  return {
    isKeyPressed: isKeyPressed
  };

})();

