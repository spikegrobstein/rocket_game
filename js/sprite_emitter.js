(function( globals, document ) {

  // direction, rate, spread, sprite options
  var SpriteEmitter = function( controller, options ) {
    this.controller = controller;
    this.last_emit = this.controller.ticks;

    this.x = U.default_param( options.x, 0 );
    this.y = U.default_param( options.y, 0 );

    this.rate = U.default_param( options.rate, 60 ); // 60fps, 1s.
    this.max = U.default_param( options.max, 10 );
    this.count = 0;

    this.angle = U.default_param( options.angle, -90 );
    this.speed = U.default_param( options.speed, 20 );
  };

  SpriteEmitter.prototype.signal = function() {

    // console.log( { c: this.controller.ticks, le: this.last_emit, r: this.rate} )

    if ( this.controller.ticks > (this.last_emit + this.rate) ) {
      this.emit();
    }
  }


  SpriteEmitter.prototype.emit = function() {
    if ( this.count >= this.max ) {
      return;
    }

    var element = document.createElement('div');
    element.setAttribute('class', 'rocket');
    // this.controller.element.appendChild( element );

    var sprite = new Sprite( element, { x:this.x, y:this.y, use_rotation:true } );

    sprite.setAngle( this.angle, this.speed );

    this.controller.add_sprite( sprite );

    this.last_emit = this.controller.ticks;
    this.count++;
  }

  globals.SpriteEmitter = SpriteEmitter;

})( window, document );
