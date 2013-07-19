(function( globals, document ) {

  var game_controller = new GameController( document.getElementById('rocket_game') );

  game_controller
    .addBehavior( 'gravity', function() {
      var g = .05;

      if ( this.hasTag('no_gravity') ) { return ; }

      this.velocity_y += g;

    } )
    .addBehavior( 'bounce', function() {
      var bounce_factor = .8;

      // if ( this.hasTag('rocket') ) { return; }

      if ( this.y > 400 ) {
        this.y = 400;
        this.velocity_y = -this.velocity_y * bounce_factor;
      }

    } )
    .addBehavior( 'rocket_observer', function() {
      if ( ! this.hasTag('rocket') ) { return; }

      if ( this.y > 450 ) {
        // alert('Boom: ' + this.velocity_y);
        this.velocity_y = 0;
        this.addTag('no_gravity');
      }

      if ( this.fuel > 0 ) {
        if ( this.rocket_on ) {
          this.velocity_y -= 0.25;
          this.fuel -= 0.1
        }
      }

    } )
    .addBehavior( 'death', function() {
      if ( this.hasTag('rocket') ) { return; }
      var life = 3000; // 5 seconds

      this.life = U.default_param( this.life, life );

      if ( Date.now() - this.timestamp > this.life ) {
        this.dead = true;
      }

    });

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
  var rocket_element = document.createElement('div');
  rocket_element.setAttribute('class', 'rocket');
  var rocket = new Sprite( rocket_element, {
    x: 300,
    y: 100,
    tags: [ 'rocket' ]
  });

  rocket.setAngle(0, 0);
  rocket.setSpriteAngle(-90);
  rocket.fuel = 100;

  game_controller.add_sprite( rocket );

  game_controller.message_bus.subscribe( 'blast', function() { this.count = 0; }.bind(emitter) );

  var keyboard_driver = new KeyboardDriver(game_controller.message_bus);

  keyboard_driver.handle(' ', function() {
    this.rocket_on = true;
  }.bind(rocket),
  function() {
    this.rocket_on = false;
  }.bind(rocket));

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
