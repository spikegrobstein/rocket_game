(function( globals, document ) {

  var field = document.getElementById('rocket_game');

  var game_controller = new GameController( field );

  var rocket_element = document.createElement('div');
  rocket_element.setAttribute('class', 'rocket');
  field.appendChild(rocket_element);

  var rocket = new Sprite( rocket_element, { velocity_x: .75, velocity_y: .75, use_rotation: true, x:375, y:275 });
  game_controller.add_sprite( rocket );

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
