(function( globals ) {
  var Sprite = function( element, options ) {
    options = U.default_param( options, {} );

    // initialize it with an element
    this.element = element;

    this.x = U.default_param( options.x, 0 );
    this.y = U.default_param( options.y, 0 );

    // velocities, etc.
    // this.angle = options.angle || 0;
    // this.speed = options.speed || 0;

    //velocities
    this.velocity_x = U.default_param( options.velocity_x, 0 );
    this.velocity_y = U.default_param( options.velocity_y, 0 );

    // set this to true to have the element rotate
    this.use_rotation = U.default_param( options.use_rotation, false );

    this.game_controller = U.default_param( options.game_controller, null );
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
    // need to inverse the y axis because it's kinda upside down and convert to degrees
    var degrees = U.Math.rad2deg( Math.atan2( this.velocity_x, -this.velocity_y ) );

    // we want this angle to be in sync with the same angles that CSS uses for rotation
    // so this ensures that what CSS calls 10 degress is the same thing we call 10 degrees
    degrees -= 90;
    if ( degrees < 0 ) {
      degrees += 360;
    }

    return degrees;
  };

  // return the speed based on the x and y velocities using the pythagorean theorum.
  Sprite.prototype.speed = function() {
      return Math.sqrt( Math.pow( this.velocity_x, 2 ) + Math.pow( this.velocity_y, 2 ) );
  };

  // given an angle and speed, set the x/y velocities
  Sprite.prototype.setAngle = function( angle, speed ) {
    var angle_radians = U.Math.deg2rad( angle );
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
