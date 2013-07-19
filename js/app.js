(function( globals, document ) {

  var field = document.getElementById('rocket_game');

  var game_controller = new GameController( field );

  var rocket = null;
  var i = 0;
  // for ( i = 0; i < 20; i++ ) {
    // var rocket_element = document.createElement('div');

    // rocket_element.setAttribute('class', 'rocket');
    // field.appendChild(rocket_element);

    // rocket = new Sprite( rocket_element, {x:300 , y:420, use_rotation: true });

    // var angle = Math.random() * 140 + 20 ;
    // var speed = Math.random() * 6 + 20;

    // rocket.setAngle(-angle, speed);
    // game_controller.add_sprite( rocket );
  // }

  // var rocket = new Sprite( rocket_element, { velocity_x: .75, velocity_y: .75, use_rotation: true, x:50, y:380 });
  // rocket.setAngle(-45, 5);

  var gravity = function() {
    var g = .5;
    var resistance = 0;//.025;

    if ( this.hasTag('no_gravity') ) { return ; }

    this.velocity_y += g;

    if ( this.velocity_x > 0 ) {
      this.velocity_x -= resistance;
    } else {
      this.velocity_x += resistance;
    }
  };

  var bounce = function() {
    var bounce_factor = .8;

    if ( this.y > 400 ) {
      this.y = 400;
      this.velocity_y = -this.velocity_y * bounce_factor;
    }
  }

  var death = function() {
    var life = 3000; // 5 seconds

    this.life = U.default_param( this.life, life );

    if ( Date.now() - this.timestamp > this.life ) {
      this.dead = true;
    }
  }

  game_controller.add_filter( gravity );
  game_controller.add_filter( bounce );
  game_controller.add_filter( death );

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

  game_controller.add_emitter( emitter );

  game_controller.run();

  game_controller.message_bus.subscribe( 'blast', function() { this.count = 0; }.bind(emitter) );

  var keyboard_driver = new KeyboardDriver(game_controller.message_bus);

  keyboard_driver.handle(' ', function() {
    rocket.setAngle( rocket.angle() + 45 );
  });

  keyboard_driver.handle(39, function() {
    rocket.setAngle( rocket.angle() + 1 );
  });

  keyboard_driver.handle(37, function() {
    rocket.setAngle( rocket.angle() - 1 );
  });

  keyboard_driver.handle('B', function() {
    this.publish('blast');
  }.bind(game_controller.message_bus));

  keyboard_driver.handle('A', function() { console.log('a was pressed' ) } );

  globals.keyboard_driver = keyboard_driver;
  globals.game_controller = game_controller;

})( window, document );
