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
  };

  GameController.prototype.add_sprite = function( sprite ) {
    this.sprites.push( sprite );
  };

  GameController.prototype.run = function(id) {
    //this.run_loop = setInterval( this.step.bind(this), this.frame_delay );

    requestAnimFrame(this.run.bind(this));
    this.step();
    this.ticks += 1;
  };

  GameController.prototype.step = function(timestamp) {
    var sprite = null;
    for ( sprite in this.sprites ) {
      sprite = this.sprites[sprite];

      sprite.step( this );
    }
  };

  globals.GameController = GameController;

})( window, document );
