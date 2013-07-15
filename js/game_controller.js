(function( globals, document ) {
  var GameController = function( element, options ) {
    this.element = element;
    this.frame_delay = 10;
    this.sprites = [];
  };

  GameController.prototype.add_sprite = function( sprite ) {
    this.sprites.push( sprite );
  };

  GameController.prototype.run = function() {
    this.run_loop = setInterval( this.step.bind(this), this.frame_delay );
  };

  GameController.prototype.step = function() {
    var sprite = null;
    for ( sprite in this.sprites ) {
      sprite = this.sprites[sprite];

      sprite.step();
    }
  };

  var field = document.getElementById('rocket_game');

  var game_controller = new GameController( field );

  var rocket_element = document.createElement('div');
  rocket_element.setAttribute('class', 'rocket');
  field.appendChild(rocket_element);

  var rocket = new Sprite( rocket_element, { speed: 1 });
  game_controller.add_sprite( rocket );

  game_controller.run();

  globals.game_controller = game_controller;
})( window, document );
