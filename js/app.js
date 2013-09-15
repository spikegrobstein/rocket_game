(function( globals, document ) {

  var game_controller = new GameController( document.getElementById('rocket_game') );

  globals.gravity = 0;
  globals.bounce_factor = 1;

  game_controller
    .addBehavior( 'gravity', function() {

      if ( this.hasTag('no_gravity') ) { return ; }

      var g = globals.gravity;
      this.velocity_y += g;

    } )
    .addBehavior( 'bounce', function() {
      var bounce_factor = globals.bounce_factor;

      // if ( this.hasTag('rocket') ) { return; }

      if ( this.y > 550 ) {
        this.y = 550;
        this.velocity_y = -this.velocity_y * bounce_factor;
      } else if ( this.y < 0 ) {
        this.y = 0;
        this.velocity_y = -this.velocity_y * bounce_factor;
      }

      if ( this.x > 750 ) {
        this.x = 750;
        this.velocity_x = -this.velocity_x * bounce_factor;
      } else if ( this.x < 0 ) {
        this.x = 0;
        this.velocity_x = -this.velocity_x * bounce_factor;
      }

    } )
    .addBehavior( 'death', function() {
      if ( globals.gravity == 0 ) { return ; }

      if ( this.y > 545 && this.velocity_y < 1 && this.velocity_y > -1 ) {
        this.dead = true;
      }
    } );

  var emitter = new SpriteEmitter( game_controller, {
    angle:-60,
    speed: 15,
    rate: 2.5,
    concurrency: 10,
    splay: 30,
    speed_splay: 10,
    life: 5000,
    max: 10,
    x:300,
    y:220 } );

  // game_controller.add_emitter( emitter );

  // create rocket
  var i = 0;
  for ( i = 0; i < 100; i++ ) {
    var rocket_element = document.createElement('div');
    rocket_element.setAttribute('class', 'rocket');
    var rocket = new Sprite( rocket_element, {
      x: Math.random() * 800,
      y: Math.random() * 600,
      use_rotation: true
    });

    rocket.setAngle( Math.random() * 360, Math.random() * 5 + 1);
    game_controller.add_sprite( rocket );

  }


  game_controller.message_bus.subscribe( 'blast', function() { this.count = 0; }.bind(emitter) );

  var keyboard_driver = new KeyboardDriver(game_controller.message_bus);

  keyboard_driver.handle(' ', function() {
    globals.gravity = 0.2;
    globals.bounce_factor = 0.8;
  });

  // keyboard_driver.handle(' ', function() {
    // this.rocket_on = true;
  // }.bind(rocket),
  // function() {
    // this.rocket_on = false;
  // }.bind(rocket));

  // left
  keyboard_driver.handle(37, function() {
    this.velocity_x -= 1;
  }.bind(rocket));
  // right
  keyboard_driver.handle(39, function() {
    this.velocity_x += 1;
  }.bind(rocket));


  keyboard_driver.handle('B', function() {
    this.publish('blast');
  }.bind(game_controller.message_bus));

  keyboard_driver.handle('A', function() { console.log('a was pressed' ) } );

  // ok, start it up
  game_controller.run();

  // attach some shit to the main window
  globals.keyboard_driver = keyboard_driver;
  globals.game_controller = game_controller;

})( window, document );
