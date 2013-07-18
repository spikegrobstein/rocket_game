(function ( globals ) {
  var Module = (function() {

    return {

      // given a param, return the default_value if param is undefined
      // alternatively, if the param is a function and call_function is truthy, call the function.
      // the latter use-case is good if the default value is an expensive operation.
      // when using the function form, the caller should take care to bind() if needed
      default_param: function( param, default_value, call_function ) {
        if ( typeof param === 'undefined' ) { return default_value; }
        if ( typeof param === 'function' && call_function ) { return param(); }

        return param;
      }

    }

  })();

  globals.U = Module;

})( window );
