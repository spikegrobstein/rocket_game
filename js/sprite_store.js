// stores and manages sprites
// interface for doing sprite queries
// nth sprite -- fast based on array index
// sprites for tag -- super fast query based on hash index
// sprites overlapping a box -- slow; has to iterate over all sprites
// sprites contained in a box -- slow; has to iterate over all sprites
// garbage collectino
// sprite iterators

// addSprite --
// registerSpriteForTag
// deleteSprite
// addToGarbageCollector
// spritesForTag
(function( globals ) {
  var SpriteStore = function( message_bus ) {
    this.message_bus = message_bus;

    this._sprites = new HashSet(); // HashSet of sprites we're managing
    this._index = {};   // hash of HashSets keyed by tag
  };

  // returns the number of sprites in storage
  SpriteStore.prototype.count = function() {
    return this._sprites.size();
  };

  // given a zero-based index, return that sprite from storage
  SpriteStore.prototype.getSprite = function( index ) {
    return this._sprites.values()[index];
  };

  // given a Sprite object, add that sprite to storage
  // if the sprite has tags, those will be indexed.
  SpriteStore.prototype.addSprite = function( sprite ) {
    this._sprites.add( sprite );

    var tag;
    for ( tag in sprite.tags ) {
      this.addSpriteToTags( tag, sprite );
    }

    this.message_bus.publish( 'sprite_added', { store: this, sprite: sprite } );

    return this;
  };

  SpriteStore.prototype.spritesWithTag = function( tag ) {
    var sprites = this._index[tag];

    if ( typeof sprites === 'undefined' ) {
      return [];
    }

    return sprites.values();
  }

  // given a Sprite object, delete it from storage
  SpriteStore.prototype.deleteSprite = function( sprite ) {
    this._sprites.remove( sprite );

    var tag;
    for ( tag in sprite.tags ) {
      this._index[tag].remove( sprite );
    }

    this.message_bus.publish( 'sprite_deleted', { store: this, sprite: sprite } );

    return this;
  };

  // given a tag and a sprite, add given sprite to the tag index
  SpriteStore.prototype.addSpriteToTags = function( tag, sprite ) {
    if ( typeof this._index[tag] === 'undefined' ) {
      this._index[tag] = new HashSet();
    }

    this._index[tag].add( sprite );

    return this;
  };

  globals.SpriteStore = SpriteStore;
})( window );
