(function( globals ) {
  var Sprite = function( element, options ) {
    options = U.default_param( options, {} );

    // initialize it with an element
    this.element = element;

    this.x = U.default_param( options.x, 0 );
    this.y = U.default_param( options.y, 0 );

    //velocities
    this.velocity_x = U.default_param( options.velocity_x, 0 );
    this.velocity_y = U.default_param( options.velocity_y, 0 );


    // tags:
    this.tags = {};
    var tags = U.default_param( options.tags, [] );
    var tag = null;
    for ( tag in tags ) {
      tag = tags[tag];
      this.addTag( tag );
    }

    // set this to true to have the element rotate
    this.use_rotation = U.default_param( options.use_rotation, false );

    // the angle to rotate the sprite when use_rotation is false
    this.rotation = 0;

    this.timestamp = Date.now(); // a timestamp of when it was created

    this.dead = false;

    this.move(); // force it to the right locaion
  }

  // return true if this sprite has the given tag
  Sprite.prototype.hasTag = function( tag ) {
    return typeof this.tags[tag] !== 'undefined';
  };

  // add a tag to this sprite, but only if it doesn't already have one
  // return this to enable chaining.
  Sprite.prototype.addTag = function( tag ) {
    this.tags[tag] = 1;

    return this;
  }

  // remove the given tag
  // return this to enable chaining.
  Sprite.prototype.removeTag = function( tag ) {
    delete this.tags[tag];

    return this;
  }

  Sprite.prototype.isOverlapping = function( other_sprite ) {
    var this_width = this.element.offsetWidth,
        this_height = this.element.offsetHeight,
        other_width = other_sprite.element.offsetWidth,
        other_height = other_sprite.element.offsetHeight,
        a_x1 = this.x,
        a_y1 = this.y,
        a_x2 = this.x + this_width,
        a_y2 = this.y + this_height,
        b_x1 = other_sprite.x,
        b_y1 = other_sprite.y,
        b_x2 = other_sprite.x + other_width,
        b_y2 = other_sprite.y + other_height;

    // console.log(this);
    // console.log(other_sprite);
    // console.log('-');
    // return true;

    return a_x1 < b_x2
      && a_x2 > b_x1
      && a_y1 < b_y2
      && a_y2 > b_y1;

    return this.x < other_sprite.x + other_width
      && this.x + this_width > other_sprite.x
      && this.y < other_sprite.y + other_height
      && this.y + this_height > other_sprite.y;
  }

  // move this object to the given x,y coordinates
  Sprite.prototype.move_to = function( x, y ) {
    this.x = x;
    this.y = y;
    this.move();
  };

  // move to the current this.x/this.y
  // also handle applying any necessary rotation
  Sprite.prototype.move = function() {
    var translate = 'translate3d(' + this.x + 'px,' + this.y + 'px,0)';

    if ( this.use_rotation ) {
      // auto-rotate (face the direction of movement)
      translate += 'rotate(' + this.angle() + 'deg)';
    } else {
      // manual rotation (use setSpriteRotation() to rotate sprite)
      translate += 'rotate(' + this.rotation + 'deg)';
    }

    this.element.style['transform'] = translate;
    this.element.style['-ms-transform'] = translate;
    this.element.style['-webkit-transform'] = translate;

    return this;
  };

  // calculate the angle based on x/y velocities
  Sprite.prototype.angle = function() {
    // need to inverse the y axis because it's kinda upside down and convert to degrees
    var degrees = U.Math.rad2deg( Math.atan2( this.velocity_x, -this.velocity_y ) );

    // we want this angle to be in sync with the same angles that CSS uses for rotation
    // so this ensures that what CSS calls 10 degress is the same thing we call 10 degrees
    // 0 degrees == ->
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

    return this;
  }

  // manually rotate the sprite.
  // This only works if this.use_rotation is false
  Sprite.prototype.setSpriteRotation = function( angle, delay_rotate ) {
    this.rotation = angle;

    // if delay_rotate is set, don't move immediately.
    delay_rotate || this.move();

    return this;
  }

  // fire one animation step.
  // based on the velocity, this will move the sprite one animation frame.
  Sprite.prototype.step = function() {
    this.move_to( this.x + this.velocity_x, this.y + this.velocity_y );
  };

  globals.Sprite = Sprite;

})( window );
