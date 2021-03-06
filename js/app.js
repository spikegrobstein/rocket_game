(function( globals, document ) {

  var game_controller = new GameController( document.getElementById('rocket_game') );

  globals.gravity = 0.2;
  globals.bounce_factor = 1;

  game_controller
    .addBehavior( 'gravity-effect', 'gravity', function() {

      var g = globals.gravity;
      this.velocity_y += g;

    } )
    .addBehavior( 'superman-hover', 'superman', function() {
      this.velocity_y = Math.sin( globals.game_controller.ticks / 10 );
    } )
    .addBehavior( 'superman-collision', 'bouncer', function() {
      if ( this.hasTag('gravity') ) { return; }

      var superman = globals.game_controller.spritesWithTag( 'superman' )[0];

      if ( superman.isOverlapping( this, 15 ) ) {
        this.addTag( 'gravity' );
        this.element.className += ' dead';
      }
    } )
    .addBehavior( 'bounce', 'bouncer', function() {
      var bounce_factor = this.hasTag('gravity') ? .4 : 1;

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
    .addBehavior( 'death', 'gravity', function() {
      // if ( globals.gravity == 0 ) { return ; }

      if ( this.y > 545 && this.velocity_y < 1 && this.velocity_y > -1 ) {
        this.dead = true;
      }
    } )
    .addBehavior( 'player', 'player', function() {
      var platform = globals.game_controller.spritesWithTag( 'platform' )[0],
          platform_c = platform.coordinates();

      if ( this.isOverlapping( platform ) ) {
        this.velocity_y = -1;
        this.y = platform.y - this.coordinates().height;
        return;
      }

      this.velocity_y += globals.gravity;
    } );

  var emitter = new SpriteEmitter( game_controller, {
    tags: [ 'bouncer' ],
    angle:35,
    speed: 10,
    rate: 1,
    concurrency: 5,
    splay: 30,
    speed_splay: 2,
    life: 5000,
    max: 100,
    x:300,
    y:220 } );

  game_controller.add_emitter( emitter );

  var platform_element = document.createElement('div');
  platform_element.className = 'platform';
  var platform = new Sprite( platform_element, {
    x: 10,
    y: 500,
    tags: [ 'platform' ]
  } );
  game_controller.addSprite( platform );

  var player_element = document.createElement('div');
  player_element.className = 'player';
  var player = new Sprite( player_element, {
    x: 150,
    y: 300,
    tags: [ 'player' ]
  } );
  game_controller.addSprite( player );

  var superman_element = document.createElement('div');
  superman_element.setAttribute('class', 'superman');
  var superman = new Sprite( superman_element, {
    x: 400,
    y: 300,
    tags: [ 'superman' ]
  });
  game_controller.addSprite( superman );

  // create rocket
  var i = 0;
  for ( i = 0; i < 100; i++ ) {
    var rocket_element = document.createElement('div');
    rocket_element.setAttribute('class', 'rocket');
    var rocket = new Sprite( rocket_element, {
      x: Math.random() * 800,
      y: Math.random() * 600,
      tags: [ 'bouncer' ],
      use_rotation: true
    });

    rocket.setAngle( Math.random() * 360, Math.random() * 5 + 1);
    game_controller.addSprite( rocket );

  }

  game_controller.message_bus.subscribe( 'player-jump', function() {
    player.velocity_y = -10;
  } );

  game_controller.message_bus.subscribe( 'blast', function() { this.count = 0; }.bind(emitter) );

  var keyboard_driver = new KeyboardDriver(game_controller.message_bus);

  keyboard_driver.handle( 'J', function() {
    game_controller.message_bus.publish( 'player-jump' );
  });

  keyboard_driver.handle(' ', function() {
    var s,
        sprites = game_controller.sprite_store.spritesWithTag('bouncer');
    for ( s in sprites ) {
      s = sprites[s];
      s.addTag('gravity');
      s.element.className += ' dead';
    }
  });

  // keyboard_driver.handle(' ', function() {
    // this.rocket_on = true;
  // }.bind(rocket),
  // function() {
    // this.rocket_on = false;
  // }.bind(rocket));

  // left
  // keyboard_driver.handle(37, function() {
    // this.velocity_x -= 1;
  // }.bind(rocket));
  // // right
  // keyboard_driver.handle(39, function() {
    // this.velocity_x += 1;
  // }.bind(rocket));


  keyboard_driver.handle('B', function() {
    this.publish('blast');
  }.bind(game_controller.message_bus));

  keyboard_driver.handle('A', function() { console.log('a was pressed' ) } );

  // attach some shit to the main window
  globals.keyboard_driver = keyboard_driver;
  globals.game_controller = game_controller;

  globals.debug = false;

  // ok, start it up
  game_controller.run();


})( window, document );
