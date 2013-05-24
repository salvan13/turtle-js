Turtle.sound = (function(){

  "use strict";

  var data = {};

  var add = function(id, sound) {
      data[id] = sound;
  };

  var play = function(id, loop) {
    if(data[id]) {
      var a = new Audio(data[id]);
      a.loop = loop || false;
      a.play();
    }
  };

  return {
    add: add,
    play: play
  };

})();
