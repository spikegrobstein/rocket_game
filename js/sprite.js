(function( globals ) {
  var Sprite = function( element, options ) {
    if ( options === undefined ) {
      options = {};
    }

    // initialize it with an element
    this.element = element;

    this.x = options.x || 0;
    this.y = options.y || 0;

    // velocities, etc.
    this.angle = options.angle || 0;
    this.speed = options.speed || 0;
  }

  // move this object to the given x,y coordinates
  Sprite.prototype.move_to = function( x, y ) {
    this.x = x;
    this.y = y;
    this.move();
  };

  // move to the current x/y
  Sprite.prototype.move = function() {
    this.element.style.left = this.x + 'px';
    this.element.style.top = this.y + 'px';
  }

  // fire one animation step.
  // based on the velocity, this will move the sprite one animation frame.
  Sprite.prototype.step = function() {
    var scale_x = Math.cos(this.angle * (Math.PI/180)),
        scale_y = Math.sin(this.angle * (Math.PI/180)),
        dx = (this.speed * scale_x),
        dy = (this.speed * scale_y);

    this.move_to( this.x + dx, this.y + dy );
  };

  globals.Sprite = Sprite;

})( window );
