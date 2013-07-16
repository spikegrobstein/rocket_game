(function( globals, document ) {
  var KeyboardDriver = function( message_bus ) {
    this.handlers = {};
    this.state = {};

    message_bus.subscribe('keydown', function( msg_type, event ) {
      var key = event.which;

      this.state[key] = true;

      if ( this.handlers[key] ) {
        this.handlers[key].down(this);
      }
    }.bind(this));

    message_bus.subscribe('keyup', function( msg_type, event ) {
      var key = event.which;

      this.state[key] = false;

      if ( this.handlers[key] ) {
        this.handlers[key].up(this);
      }
    }.bind(this));
  };

  KeyboardDriver.prototype.handle = function( key, down_callback, up_callback ) {
    if ( typeof key === 'string' ) {
      key = key.charCodeAt(0);
    }
    this.handlers[key] = { down: down_callback, up: up_callback }
  };

  globals.KeyboardDriver = KeyboardDriver;

})( window, document );
