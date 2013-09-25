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

    this.behaviors = {};
    this.emitters = [];

    this.message_bus = new MessageBus();
    this.sprite_store = new SpriteStore( this.message_bus );

    this.message_bus.subscribe( 'sprite_deleted', this.handleSpriteDeleted.bind(this) );
    this.message_bus.subscribe( 'sprite_added', this.handleSpriteAdded.bind(this) );

    document.addEventListener('keydown', function(event) {
      this.message_bus.publish('keydown', event);
    }.bind(this));

    document.addEventListener('keyup', function(event) {
      this.message_bus.publish('keyup', event);
    }.bind(this));
  };

  GameController.prototype.handleSpriteDeleted = function( type, payload ) {
    var sprite = payload.sprite,
        store = payload.store;

    this.element.removeChild( sprite.element );
  };

  GameController.prototype.handleSpriteAdded = function( type, payload ) {
    var sprite = payload.sprite,
        store = payload.store;

    this.element.appendChild( sprite.element );
  };

  GameController.prototype.add_sprite = function( sprite ) {
    sprite.message_bus = this.message_bus;
    this.sprite_store.addSprite( sprite );

    sprite.game_controller = this;
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

  GameController.prototype.spritesWithTag = function( tag ) {
    return this.sprite_store.spritesWithTag( tag );
  }

  // turn on animations
  GameController.prototype.run = function(id) {
    requestAnimFrame(this.run.bind(this));
    this.step();
    this.ticks += 1;
  };

  // animate one frame
  GameController.prototype.step = function(timestamp) {
    var emitter = null,
        sprite = null,
        i = 0
        behavior_handler = null;

    // iterate over emitters and fire them
    // these create sprites that will then have their behaviors called
    // then step()
    for ( emitter in this.emitters ) {
      emitter = this.emitters[emitter];

      emitter.signal();
    }

    // iterate over all sprites and run all behaviors against them

    var sprites = this.sprite_store._sprites.values();
    for ( sprite in sprites ) {
      sprite = sprites[sprite];

      // kill any sprites marked dead and move on.
      if ( sprite.dead ) {
        this.sprite_store.deleteSprite( sprite );

        continue;
      }

      // modify the sprite before having it step.
      for ( behavior_handler in this.behaviors ) {
        behavior_handler = this.behaviors[behavior_handler];

        behavior_handler.call( sprite, this );
      }

      sprite.step( this );
    }
  };

  globals.GameController = GameController;

})( window, document );
