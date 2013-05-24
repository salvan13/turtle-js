test("basic test", function() {

  equal(1, 1, "1 and 1 are equals");

});

test("engine test", function() {

  ok(Turtle, "Turtle exist");
  ok(Turtle.init, "Turtle init exist");

});

test("scene test", function() {

  ok(Turtle.Scene, "Turtle.Scene exist");

});

test("object test", function() {

  var player = new Turtle.Object('player', {y: 10});
  equal(player.x, 0, "player default x pos");
  equal(player.y, 10, "player y pos");
  ok(player.is("default"), "default type");

  var b1 = new Turtle.Object('block1', {y: 10, x: 10, type: ['block', 'anithing']});
  equal(b1.x, 10, "block x pos");
  ok(b1.is('block'), 'is a block?');
  ok(b1.is('anithing'), 'is a anithing?');
  ok(!b1.is('default'), 'is a default?');

  player.collect('key');
  equal(player.has('key'), 1, 'has a key');
  player.collect('key');
  equal(player.has('key'), 2, 'has 2 keys');
  equal(player.has('bomb'), 0, 'has no bombs');

});


test("map tests", function(){

  var map = [
    "xxxxxxxxxxxxxxx",
    "x             x",
    "x  xxxxxxxxx  x",
    "x xx          x",
    "xxxxxxxxxxxxxxx"
  ];

  var result = Turtle.Map.fromStrings(map, {
      x: function(x, y) {
        var r = new Turtle.Object('block', {
          type: ['block'],
          x: x * 12,
          y: y * 12
        });
        return r;
      }
  });

  ok(result[0][0].is('block'), 'primo blocco');
  ok(result[4][14].is('block'), 'ultimo blocco');
  equal(result[1][1], undefined, 'blocco vuoto');
  equal(result[4][14].x, 14 * 12, 'x ultimo blocco');

});
