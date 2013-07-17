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
  }

  // calculate the angle based on velocities
  Sprite.prototype.angle = function() {
    var degrees = null;
    if ( this.velocity_x > 0 ) {
      degrees = Math.tan( this.velocity_y / this.velocity_x ) * ( 180 / Math.PI );
    } else {
      degrees = 0;
    }

    // vx, vy
    // 1, 1 -- 45
    // 0, 1 -- 90
    // -1, 1 -- 90 + 45
    // -1, 0 -- 90 + 90
    // -1, -1 -- 90 + 90 + 45
    // 0, -1 -- 90 + 90 + 90
    // 1, -1 -- 90 + 90 + 90 + 45
    // 1, 0 -- 0

    // quadrants:
    //  2 | 3
    // -------
    //  1 | 0

    var quadrant = 0;
    if ( this.velocity_x >= 0 && this.velocity_y >= 0 ) {
      quadrant = 0;
    } else if ( this.velocity_x <= 0 && this.velocity_y >= 0 ) {
      quadrant = 1;
    } else if ( this.velocity_x <= 0 && this.velocity_y <= 0 ) {
      quadrant = 2;
    } else if ( this.velocity_x >= 0 && this.velocity_y <= 0 ) {
      quadrant = 3;
    }

    return degrees + ( 90 * quadrant );
  }

  Sprite.prototype.setAngle = function( angle, speed ) {
    var angle_radians = (( angle ) * ( Math.PI/180 )),
        scale_x = Math.cos( angle_radians ),
        scale_y = Math.sin( angle_radians );

    if ( typeof speed === 'undefined' ) {
      speed = Math.sqrt( Math.pow( this.velocity_x, 2 ) + Math.pow( this.velocity_y, 2 ) );
    }

    console.log({angle_radians: angle_radians, scale_x: scale_x, scale_y: scale_y, speed:speed})

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
