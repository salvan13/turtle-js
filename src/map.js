Turtle.Map = (function() {

  var fromStrings = function(arr, settings) {
    var res = [];
    for(var y = 0; y < arr.length; y++) {
      res[y] = [];
      for(var x = 0; x < arr[y].length; x++) {
        var f = settings[arr[y][x]];
        if(f) {
          res[y][x] = f(x, y);
        }
      }
    }
    return res;
  };

  return {
    fromStrings: fromStrings
  };

})();
