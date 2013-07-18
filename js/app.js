(function( globals, document ) {

  var field = document.getElementById('rocket_game');

  var game_controller = new GameController( field );

  var rocket = null;
  var i = 0;
  for ( i = 0; i < 20; i++ ) {
    var rocket_element = document.createElement('div');

    rocket_element.setAttribute('class', 'rocket');
    field.appendChild(rocket_element);

    rocket = new Sprite( rocket_element, {x:300 , y:380, use_rotation: true, tags:['no_gravity']});

    var angle = Math.random() * 140;
    var speed = Math.random() * 6 + 16;

    rocket.setAngle(-angle, speed);
    game_controller.add_sprite( rocket );
  }

  // var rocket = new Sprite( rocket_element, { velocity_x: .75, velocity_y: .75, use_rotation: true, x:50, y:380 });
  // rocket.setAngle(-45, 5);

  var gravity = function( sprite ) {
    var g = .5;
    var resistance = 0;//.025;

    if ( sprite.hasTag('no_gravity') ) { return ; }

    sprite.velocity_y += g;

    if ( sprite.velocity_x > 0 ) {
      sprite.velocity_x -= resistance;
    } else {
      sprite.velocity_x += resistance;
    }
  };

  var bounce = function( sprite ) {
    var bounce_factor = .8;

    if ( sprite.y > 400 ) {
      sprite.y = 400;
      sprite.velocity_y = -sprite.velocity_y * bounce_factor;
    }
  }

  game_controller.add_filter( gravity );
  game_controller.add_filter( bounce );

  game_controller.run();

  var keyboard_driver = new KeyboardDriver(game_controller.message_bus);

  keyboard_driver.handle(' ', function() {
    rocket.setAngle( rocket.angle() + 45 );
  });

  keyboard_driver.handle(39, function() {
    rocket.setAngle( rocket.angle() + 1 );
  });

  keyboard_driver.handle(37, function() {
    rocket.setAngle( rocket.angle() - 1 );
  })

  keyboard_driver.handle('A', function() { console.log('a was pressed' ) } );

  globals.keyboard_driver = keyboard_driver;
  globals.game_controller = game_controller;

})( window, document );
