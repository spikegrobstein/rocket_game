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

    // set this to true to have the element rotate
    this.use_rotation = options.use_rotation || false;
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
    var angle_degrees = ((this.angle - 90) * (Math.PI/180)),
        scale_x = Math.cos( angle_degrees ),
        scale_y = Math.sin( angle_degrees ),
        dx = (this.speed * scale_x),
        dy = (this.speed * scale_y);

    if ( this.use_rotation ) {
      var rotation = 'rotate(' + this.angle + 'deg)';

      this.element.style['transform'] = rotation;
      this.element.style['-ms-transform'] = rotation;
      this.element.style['-webkit-transform'] = rotation;
    }

    this.move_to( this.x + dx, this.y + dy );
  };

  globals.Sprite = Sprite;

})( window );
