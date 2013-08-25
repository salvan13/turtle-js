Turtle.sound = (function(){

  "use strict";

  var sounds = {};

  var add = function(id, sound) {
      sounds[id] = new Audio(sound);
  };

  var play = function(id, loop) {
    if(sounds[id]) {
      var s = sounds[id];
      s.loop = loop || false;
      s.play();
    }
  };

  return {
    add: add,
    play: play
  };

})();
