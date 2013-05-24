Turtle.Scene = function(id, params) {
  params = params || {};
  this.id = id;
  this.objects = [];
  this.update = params.update;
  this.draw = params.draw;
};

Turtle.Scene.prototype = {

  addObject: function(obj) {
    if(!obj) {
      return;
    }
    if (Object.prototype.toString.call(obj) === '[object Array]') {
      for(var x = 0; x < obj.length; x++) {
        this.addObject(obj[x]);
      }
    } else {
      this.objects.push(obj);
      this.objects.sort(function(a, b){
        return a.zIndex - b.zIndex;
      });
    }
  }

};

