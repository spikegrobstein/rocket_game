(function( globals, document ) {

  //rocket -- has velocity, etc
  //game -- handles stepping animation, etc.

  var Rocket = function( field ) {
    // create rocket element
    // place it someplace cool.

    this.downward_velocity = 0;
    this.fuel = 500;

    this.rocket_blasting = false;

    this.x = 0;
    this.y = 0;

    this.element = this.build_element( field );

    return this;
  };

  Rocket.prototype.build_element = function( field ) {
    var element = document.createElement('div');
    element.setAttribute('class', 'rocket');

    field.appendChild(element);

    element.style.left = (field.offsetWidth / 2 - 75) + 'px';
    element.style.top = '10px';

    this.x = element.offsetLeft;
    this.y = element.offsetTop;

    return element;
  }

  Rocket.prototype.move_to = function(x,y) {
    this.x = x;
    this.y = y;

    this.element.style.left = this.x + 'px';
    this.element.style.top = this.y + 'px';
  }

  // one frame of animation
  Rocket.prototype.step = function() {
    if (this.y >= 450) {
      if (this.downward_velocity < -5) {
        console.log('BOOM (' + this.downward_velocity + ')');
        alert('You died. Your velocity was: ' + this.downward_velocity);
      } else {
        if (this.downward_velocity != 0) {
        alert('You win!');

        }
      }
      this.downward_velocity = 0;
      return;
    }

    if (this.rocket_blasting) {
      this.downward_velocity += globals.world.gravity * 2;
    } else {
      this.downward_velocity -= globals.world.gravity;
    }

    this.y -= this.downward_velocity;

    this.move_to(this.x, this.y);
  }

  var World = function( element ) {
    this.element = element;
    this.gravity = 0.1;
    this.rocket = new Rocket( element );

    this.status = document.getElementById('rocket_status');

    return this;
  };

  World.prototype.step = function() {
    this.rocket.step();

    this.status.innerHTML = 'Downward speed: ' + Math.round(this.rocket.downward_velocity * 100) / 100;
  }

  // main loop
  World.prototype.run = function() {
    setInterval(world.step.bind(this), 10);
  }

  document.addEventListener('keydown', function(event) {
    if (event.which == 32) { // space
      globals.world.rocket.rocket_blasting = true;
      globals.world.rocket.element.style.backgroundImage = 'url("rocket_on.png")';
    }
  });

  document.addEventListener('keyup', function(event) {
    if (event.which == 32) { // space
      globals.world.rocket.rocket_blasting = false;
      globals.world.rocket.element.style.backgroundImage = 'url("rocket_off.png")';
    }
  });

  globals.world = new World( document.getElementById('rocket_game'));
  globals.world.run()

})( window, document );
