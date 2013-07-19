window.requestAnimFrame = function(){
    return (
            window.requestAnimationFrame       ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame    ||
            window.oRequestAnimationFrame      ||
            window.msRequestAnimationFrame     ||
            function(/* function */ callback){
                window.setTimeout(callback, 1000 / 60);
            }
        );
}();

(function( globals, document ) {
  var GameController = function( element, options ) {
    this.ticks = 0; // incremented for each frame that's displayed.
    this.element = element;
    this.frame_delay = 10;
    this.sprites = [];
    this.behaviors = {};
    this.emitters = [];

    this.message_bus = new MessageBus();

    document.addEventListener('keydown', function(event) {
      this.message_bus.publish('keydown', event);
    }.bind(this));

    document.addEventListener('keyup', function(event) {
      this.message_bus.publish('keyup', event);
    }.bind(this));
  };

  GameController.prototype.add_sprite = function( sprite ) {
    this.sprites.push( sprite );

    this.element.appendChild( sprite.element );

    sprite.game_controller = this;
  };

  GameController.prototype.run = function(id) {
    //this.run_loop = setInterval( this.step.bind(this), this.frame_delay );

    requestAnimFrame(this.run.bind(this));
    this.step();
    this.ticks += 1;
  };

  GameController.prototype.addBehavior = function( name, behavior_handler ) {
    this.behaviors[name] = behavior_handler ;

    return this;
  }

  GameController.prototype.removeBehavior = function( name ) {
    delete this.behaviors[name];

    return this;
  }

  GameController.prototype.add_emitter = function( emitter ) {
    this.emitters.push( emitter );
    return this;
  }

  GameController.prototype.step = function(timestamp) {
    var emitter = null;
    for ( emitter in this.emitters ) {
      emitter = this.emitters[emitter];

      emitter.signal();
    }

    var sprite = null;
    var i = 0;
    for ( i in this.sprites ) {
      sprite = this.sprites[i];

      // kill any sprites marked dead and move on.
      if ( sprite.dead ) {
        this.element.removeChild( sprite.element );
        this.sprites.splice( i, 1 );

        continue;
      }


      // modify the sprite before having it step.
      var behavior_handler = null;
      for ( behavior in this.behaviors ) {
        behavior = this.behaviors[behavior];

        behavior.call( sprite, this );
      }

      sprite.step( this );
    }
  };

  globals.GameController = GameController;

})( window, document );
