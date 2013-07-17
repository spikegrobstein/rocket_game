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
    // this.angle = options.angle || 0;
    // this.speed = options.speed || 0;

    //velocities
    this.velocity_x = options.velocity_x || 0;
    this.velocity_y = options.velocity_y || 0;

    // set this to true to have the element rotate
    this.use_rotation = options.use_rotation || false;

    this.game_controller = options.game_controller || null;
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
  };

  // calculate the angle based on velocities
  Sprite.prototype.angle = function() {
    var degrees = Math.atan2( this.velocity_x, -this.velocity_y ) * ( 180 / Math.PI );

    degrees -= 90;
    if ( degrees < 0 ) {
      degrees += 360;
    }

    return degrees;
  };

  Sprite.prototype.speed = function() {
      return Math.sqrt( Math.pow( this.velocity_x, 2 ) + Math.pow( this.velocity_y, 2 ) );
  };

  Sprite.prototype.setAngle = function( angle, speed ) {
    var angle_radians = (( angle ) * ( Math.PI/180 )),
        scale_x = Math.cos( angle_radians ),
        scale_y = Math.sin( angle_radians );

    if ( typeof speed === 'undefined' ) {
      speed = this.speed();
    }

    this.velocity_x = ( speed * scale_x ),
    this.velocity_y = ( speed * scale_y );
  }

  // fire one animation step.
  // based on the velocity, this will move the sprite one animation frame.
  Sprite.prototype.step = function() {
    if ( this.use_rotation ) {
      var rotation = 'rotate(' + this.angle() + 'deg)';

      this.element.style['transform'] = rotation;
      this.element.style['-ms-transform'] = rotation;
      this.element.style['-webkit-transform'] = rotation;
    }

    this.move_to( this.x + this.velocity_x, this.y + this.velocity_y );
  };

  globals.Sprite = Sprite;

})( window );
